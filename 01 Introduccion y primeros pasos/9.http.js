const http = require('node:http')

const server = http.createServer((req, res) => {
  console.log('Nueva petición')
  res.end('Hola mundo')
})

server.listen(0, () => {
  console.log(`Servidor escuchando en http://localhost:${server.address().port}`)
})
