# Que es REST API?
- Es una arquitectura de software. Nacida en el año 2000, creada por Roy Fielding.
- Es un conjunto de reglas y restricciones que se utilizan para crear servicios web.

## Principios en los que se basa REST
- **Cliente-Servidor**: Separación de responsabilidades.
- **Sin estado**: Cada petición que se hace al servidor debe contener toda la información necesaria para que el servidor pueda entenderla.
- **Cacheable**: Las respuestas del servidor deben ser cacheables.
- **Interfaz uniforme**: Las peticiones que se hacen al servidor deben ser uniformes.
- **Sistema en capas**: El cliente no necesita saber si está conectado directamente al servidor o a un intermediario.

De una forma enumerada:
1. Escalabilidad.
2. Simplicidad.
3. Visibilidad.
4. Portabilidad.
5. Fiabilidad.
6. Facil de modificar.

## Recursos (resources)
Todo es considerado un recurso en una arquitectura REST. Un recurso es cualquier cosa que pueda ser nombrada. Por ejemplo, un libro, un usuario, una imagen, etc.
Cada recurso se va a identificar con una *URL*.

## Verbos HTTP
Para definir las operaciones que se pueden operar con los recursos. Basicamente son los CRUD:
- **GET**: Obtener un recurso.
- **POST**: Crear un nuevo elemento/recurso en el servidor. `/movies`. No es idempotente, no porque creas siempre un nuevo recurso.
- **PUT**: Actualizar totalmente un elemento ya existente o crearlo si no existe. `/movies/123-456-678`. Si es idempotente, porque si ya existe, lo actualiza, si no, lo crea.
- **DELETE**: Eliminar un recurso.

Luego estan los verbos que no son CRUD:
- **PATCH**: Actualizar parcialmente un elemento/recurso. `/movies/123-456-678`. Normalmente SI lo podría ser idempotente, pero depende de la implementación.
- **OPTIONS**: Obtener los métodos HTTP que soporta un recurso.
- **HEAD**: Obtener los encabezados de un recurso.

## Representaciones
Los recursos pueden tener diferentes representaciones. Por ejemplo, un libro puede tener una representación en *JSON* y otra en *XML*, *HTML*.
El cliente deberia poder decidir que representación quiere.

## Stateless (Sin estado)
Cada petición que se hace al servidor debe contener toda la información necesaria para que el servidor pueda entenderla. El servidor no debe guardar información de las peticiones anteriores.

## Separación de conceptos
Permite que el cliente y el servidor evolucionen de forma independiente.

## CORS
Cross-Origin Resource Sharing. Es un mecanismo que utiliza cabeceras *HTTP* adicionales para permitir que un servidor autorice a un sitio web a acceder a sus recursos. Es un mecanismo de seguridad que permite que un navegador web pueda hacer peticiones a un servidor que no sea el mismo que sirvió la página web.

## Cuestiones de codigo...
### Idempotencia
Propiedad de realizar una acción determinada varias veces y aún así conseguir siempre el mismo resultado que se obtendría al hacerlo una vez.
Habla también del estado interno que pueden tener las cosas.

### `npx servor ./web`
Para servir archivos estáticos. 