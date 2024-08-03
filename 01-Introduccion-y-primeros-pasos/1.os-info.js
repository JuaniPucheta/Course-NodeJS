const os = require('node:os')

console.log('Informacion del sistema operativo:')
console.log('---------------------------------')

console.log('Nombre del SO:', os.platform())
console.log('Version del SO:', os.release())
console.log('Arquitectura del SO:', os.arch())
console.log('Memoria total:', os.totalmem() / 1024 / 1024, 'MB')
console.log('Memoria libre:', os.freemem() / 1024 / 1024, 'MB')
console.log('Uptime: ', (os.uptime() / 60 / 60).toFixed(2), 'horas')
console.log('CPUs:', os.cpus())


