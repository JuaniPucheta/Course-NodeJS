const http = require('node:http')

// commonJS --> modulos clasicos de node
const dittoJSON = require('./pokemon/ditto.json')

const processRequest = (req, res) => {
    const { method, url } = req

    switch (method) {
        case 'GET': 
            switch (url) {
                case '/pokemon/ditto':
                    res.setHeader('Content-Type', 'application/json; charset=utf-8')
                    return res.end(JSON.stringify(dittoJSON))
                default:
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/html; charset=utf-8')
                    return res.end('Not found')
            }

        case 'POST':
            switch (url) {
                case '/pokemon':
                    let body = ''

                    // ! SEGUIR MINUTO 47:14 
            }
    }
}

const desiredPort = pprocess.env.PORT ?? 3000
const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${desiredPort}`)
})