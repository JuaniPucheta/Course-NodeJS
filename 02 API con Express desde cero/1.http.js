//* Para que los cambios se actualicen enseguida:
/**
 * node --watch ...
 * nodemon
 */

const http = require('node:http') // Protocolo HTTP
const fs = require('node:fs') // Sistema de archivos

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/plan; charset=utf-8')

  if (req.url === '/') {
    res.end('<h1>Mi pagina</h1>')
  } else if (req.url === '/imagen-bonita.png') {
    
    fs.readFile('./estadio.png', (err, data) => {
      if (err) {
        res.statusCode = 500 // Internal Server Error
        res.end(`<h2>Internal Server Error: ${err.message}</h2>`)
      } else {
        res.setHeader('Content-Type', 'image/png')
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    res.end('<h1>Contacto</h1>')
  } else {
    res.statusCode = 404 // Not Found
    res.end('<h1>Error 404</h1>')
  }
}

// * Status code
// ? http.cat -> Imágenes de gatos con códigos de estado HTTP
/**
 * 100-199: informativos
 * 200-299: satisfactorios
 * 300-399: redirecciones
 * 400-499: errores del cliente
 * 500-599: errores del servidor
*/

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${desiredPort}`)
})
