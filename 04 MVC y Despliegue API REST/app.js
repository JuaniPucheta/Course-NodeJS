import express, { json } from 'express' // require -> commonJS
import { moviesRouter } from './routes/movies'
import { corsMiddleware } from './middlewares/cors'

// EN EL FUTURO: el import del jsons será así:
// import movies from './movies.json' with { type: 'json' }

// ❌ COMO LEER UN JSON EN ESModules (mucho mas lenta)
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`✅ Corriendo en  http://localhost:${PORT}`)
})