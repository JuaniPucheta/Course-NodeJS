/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'
import { SECRET_JWT_KEY } from './config.js'

import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

app.set('view engine', 'ejs')
app.use(express.json()) // Middleware que parsea el body de la request
app.use(cookieParser()) // Middleware que parsea las cookies de la request

//? Middleware que se ejecuta en todas las rutas y que verifica si el usuario tiene un token válido
app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
  } catch {}

  next() // --> Continúa con el siguiente middleware
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', { user })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  
  try { 
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      SECRET_JWT_KEY, 
      { 
        expiresIn: '1h' 
      }
    )

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username }, 
      SECRET_JWT_KEY, 
      { 
        expiresIn: '7d'
      }
    )

    res
      .cookie('access_token', token, { 
        httpOnly: true,  // La cookie no es accesible desde el frontend, solo desde el servidor
        secure: process.env.NODE_ENV === 'production', // La cookie solo se envía por HTTPS
        sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
        maxAge: 1000 * 60 * 60 // 1 hora de validez la cookie
      })
      .send({user, token})

    res
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días de validez la cookie
      })
      .send({user, token})
  }
  catch (error) {
    res.status(401).send(error.message)
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRepository.create({username, password})
    res.send({ id })
  } 
  catch (error) {
    // NORMALMENTE NO ES BUENA IDEA MANDAR EL ERROR DEL REPOSITORIO
    res.status(400).send(error.message)
  } 
  finally {
    res.status(201).send()
  }
})

app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token')
    .json({ message: 'Logged out'})
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(403).send('Acceso denegado')
  res.render('protected', user) // {_id, username}  
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
