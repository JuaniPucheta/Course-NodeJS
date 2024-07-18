const http = require('node:http')
const { findAvailablePort } = require('./10.free-port')

const server = http.createServer((req, res) => {
  console.log('Nueva petición')
  res.end('Hola mundo')
})

findAvailablePort(3000).then(port => {
  server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
  })
})
