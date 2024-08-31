## Base de Datos
- Usando **DataGrip**, debe crearse dentro de *@localhost* la base de datos **"moviesdb"** utilizada en este proyecto.
- No debe crearse otra base de datos distinta a *@localhost*

## Consideraciones & Aprendizajes
1. Siempre corroborar los realeases y last publish de los paquetes a instalar. Desde [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) o [pnpm](https://pnpm.io/). Por ejemplo **mysql** y **mysql2** en https://www.npmjs.com/package/mysql y https://www.npmjs.com/package/mysql2
2. Puede copiarse carpetas desde VSCODE sin necesidad de hacerlo externamente desde el explorador de archivos, con el comando `cp -r` y la ruta de origen y destino. Por ejemplo: `cp -r 04-async-await 05-bbdd-buenas-practicas`
3. Como el proyecto fue realizado con PlanetScale, el mismo sitio ya no ofrece un plan gratuito para desplegar a producción. Se trabajó hasta la creación del `.env` y la instalación de `dotenv`. Alternativa: [https://www.youtube.com/watch?v=3z_HMC0-jrc]