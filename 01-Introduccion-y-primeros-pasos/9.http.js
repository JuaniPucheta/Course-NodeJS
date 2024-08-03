const http = require('node:http')
const { findAvailablePort } = require('./10.free-port')

const desiredPort = process.env.PORT ?? 3000
// PORT=3001 node 9.http.js

const server = http.createServer((req, res) => {
  console.log('Nueva petición')
  res.end('Hola mundo')
})

findAvailablePort(desiredPort).then(port => {
  server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
  })
})
