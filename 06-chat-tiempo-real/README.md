## Dependencias
1. Morgan -> es un Logger que funciona a nivel de requestpara express. `app.use(logger('dev'))` es la forma de usarlo.
El resultado por consola es algo como esto:
```bash
GET / 304 3.013 ms - -
GET /stylesheets/style.css 304 1.013 ms - -
GET /favicon.ico 404 1.013 ms - 150
```
La cual dice que se hizo un GET a la ruta / y se respondió con un 304 en 3.013 ms.