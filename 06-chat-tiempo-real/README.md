## Dependencias
1. Morgan -> es un Logger que funciona a nivel de requestpara express. `app.use(logger('dev'))` es la forma de usarlo.
El resultado por consola es algo como esto:
```bash
GET / 304 3.013 ms - -
GET /stylesheets/style.css 304 1.013 ms - -
GET /favicon.ico 404 1.013 ms - 150
```
La cual dice que se hizo un GET a la ruta / y se respondió con un 304 en 3.013 ms.
2. Usando turso
- `wsl`
- `sudo apt update && sudo apt upgrade -y`
- `curl -sSfL https://get.tur.so/install.sh | bash`
- `turso` -> para chequear que se instaló correctamente
- `turso auth login` -> para loguearse
- `turso db show calm-malice` -> para ver la base de datos
- `turso db tokens create calm-malice` -> para crear un token
- `turso db shell primary-lady-shiva` -> para entrar a la base de datos y hacer queries

> ![IMPORTANT]
> Pendiente resolver id = null en Turso Drizzle Studio. Correo enviado al soporte de Turso para ver cómo resolverlo.