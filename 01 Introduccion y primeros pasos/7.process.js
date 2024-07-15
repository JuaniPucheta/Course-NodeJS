// process es un objeto global que provee información y control sobre el proceso de Node.js. Como un objeto global, está siempre disponible para ser requerido.

// argumentos de entrada
console.log(process.argv)


// controlar el proceso y su salida
    //* process.exit(1)

// podemos controalar eventos del proceso
process.on('exit', () => {
    console.log('El proceso terminó')
})

// current working directory
console.log(process.cwd())

// platform
console.log(process.env)