const fs = require('node:fs')

fs.readdir('.')
    .then(files => {
        files.forEach(file => {
            console.log(file)
        })
    })
    .catch(err => {
        if (err) {
            console.error('Error al leer el directorio: ', err)
            return;
        }
    })