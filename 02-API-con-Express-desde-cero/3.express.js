const express = require('express')
const ditto = require('./pokemon/ditto.json')

const PORT = process.env.PORT ?? 3000

const app = express()
app.disable('x-powered-by')

// * esto hace exactamente lo mismo que lo de abajo
app.use(express.json())
/*
    app.use((req, res, next) => {
        if (req.method !== 'POST') return next()
        if (req.headers['content-type'] !== 'application/json') return next()

        // solo llegan request que son POST y que tienen el header content-type: application/json

        let body = ''

        // escuchar el evento data
        req.on('data', (chunk) => {
            body += chunk.toString()
        })  

        req.on('end', () => {
            const data = JSON.parse(body)
            data.timestamp = Date.now()
            // mutar la request y meter la informacion en el req.body
            req.body = data
            next()
        })
    })
*/

app.get('/pokemon/ditto', (req, res) => {
    res.json(ditto)
})

app.post('/pokemon', (req, res) => {
    // req.body deberiamos guardar en bbdd
    res.status(201).json(req.body)
})

// La ultima a la que va a llegar
app.use((req, res) => {
    res.status(404).json({
        error: 'Recurso no encontrado'
    })
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})