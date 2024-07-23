const express = require('express')
const crypto = require('node:crypto') //? Módulo de Node.js para generar hashes
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')


const app = express()
app.use(express.json()) // Middleware para parsear el body de las peticiones
app.disable('x-powered-by') // deshabilita el header X-Powered-By Express

app.get('/', (req, res) => {
    res.json({ message: 'Hola Mundo!' })
})

// All los recursos que sean movies se identifica con /movies
app.get('/movies', (req, res) => {
    const { genre } = req.query
    
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }

    res.json(movies)
})

app.get('/movies/:id', (req, res) => { //! path-to-regexp
    const id = req.params.id
    const movie = movies.find(movie => movie.id === id)
    
    if (!movie) {
        res.status(404).json({ message: 'Movie not found' })
    } else {
        res.json(movie)
    }
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)
    
    if (!result.success) {
        // 422: Unprocessable Entity
        return res.status(400).json({ errors: JSON.parse(result.error.message) })
    }

    // en base de datos...
    const newMovie = {
        id: crypto.randomUUID(), // Genera un UUID v4
        ...result.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
    
    if (!result.success) return res.status(400).json({ errors: JSON.parse(result.error.message) })

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    
    movies[movieIndex] = updateMovie

    return res.json(updateMovie)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})
