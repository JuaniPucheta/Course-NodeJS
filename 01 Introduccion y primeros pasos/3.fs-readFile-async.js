//? Forma asincrona con callback
const fs = require('node:fs');

console.log('Leyendo el primer archivo...')
fs.readFileSync('./archivo.txt', 'utf-8', (err, text) => {
    console.log(text)
})

console.log('Hacer cosas mientras lee el archivo...')

console.log('Leyendo el segundo archivo...')
fs.readFileSync('./archivo2.txt', 'utf-8', (err, text) => {
    console.log(text)
})


