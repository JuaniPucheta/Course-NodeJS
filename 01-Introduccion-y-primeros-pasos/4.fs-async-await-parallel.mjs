import { readFile } from 'node:fs/promises'

Promise.all([
    readFile('./archivo.txt', 'utf-8'),
    readFile('./archivo2.txt', 'utf-8')
])
.then(([text1, text2]) => {
    console.log('Primer texto: ', text1)
    console.log('Segundo texto: ', text2)
})