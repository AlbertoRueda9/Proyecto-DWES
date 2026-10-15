# Práctica servidor - Inscripción a talleres

Aplicación web desarrollada con **Node.js, Express y EJS** para gestionar una serie de talleres y sus inscripciones.

## 1. Instalación y ejecución

Para instalar las dependencias del proyecto:

    npm install

Para iniciar el servidor:

    npm start

La aplicación se ejecuta en:

    http://localhost:3000

## 2. Estructura del proyecto

El proyecto está organizado de la siguiente manera:

- `src/server.js`: contiene el servidor Express, los datos de los talleres, las inscripciones y las diferentes rutas.
- `src/funciones.js`: contiene las funciones utilizadas para calcular plazas, comprobar inscripciones y validar los datos.
- `views/talleres.ejs`: muestra el listado de talleres y los filtros.
- `views/detalle.ejs`: muestra la información de un taller.
- `views/inscripcion.ejs`: contiene el formulario de inscripción.
- `package.json`: contiene la configuración y dependencias del proyecto.

## 3. Funcionalidades

La aplicación permite:

- Mostrar todos los talleres disponibles.
- Filtrar los talleres por categoría.
- Filtrar los talleres por nivel.
- Filtrar según si quedan plazas disponibles.
- Combinar varios filtros.
- Consultar la ficha de cada taller.
- Mostrar las plazas restantes.
- Realizar inscripciones.
- Validar los datos introducidos en el formulario.
- Evitar que un mismo correo se inscriba dos veces en el mismo taller.
- Impedir inscripciones cuando un taller está completo.
- Mostrar errores cuando el taller solicitado no existe.

## 4. Rutas principales

Las principales rutas utilizadas son:

- `GET /` → comprueba que el servidor funciona.
- `GET /talleres` → muestra el listado de talleres.
- `GET /talleres/:id` → muestra la ficha de un taller.
- `GET /talleres/:id/inscripcion` → muestra el formulario de inscripción.
- `POST /talleres/:id/inscripcion` → realiza una inscripción.

La ruta `/talleres` permite utilizar parámetros para realizar los filtros:

- `categoria`
- `nivel`
- `disponibles`

Por ejemplo:

    /talleres?categoria=web&nivel=intermedio

## 5. Funciones principales

En `funciones.js` se han creado tres funciones principales:

### `obtenerPlazasRestantes()`

Calcula las plazas que quedan disponibles en un taller teniendo en cuenta sus inscripciones.

### `estaInscrito()`

Comprueba si un correo electrónico ya está inscrito en un determinado taller.

### `validarInscripcion()`

Comprueba que los datos introducidos en el formulario sean correctos, validando principalmente el nombre y el correo electrónico.

## 6. Validaciones

Antes de realizar una inscripción se comprueba:

- Que el taller exista.
- Que queden plazas disponibles.
- Que el nombre tenga al menos 2 caracteres.
- Que el correo electrónico tenga un formato válido.
- Que el correo no esté ya inscrito en ese taller.

## 7. Pruebas

Durante la realización de la práctica se han probado las diferentes funcionalidades desde el navegador.
Se han comprobado los listados, los filtros, las fichas de los talleres, el formulario de inscripción, las validaciones y el control de plazas.
También se han comprobado diferentes situaciones de error, como introducir un email incorrecto, utilizar un taller inexistente o intentar realizar una inscripción duplicada.

## 8. Chat utilizado como apoyo

https://chatgpt.com/share/6ad0ba6e-b934-83eb-8beb-169d1f5430d3

## 19. Conclusión

Con esta práctica se ha creado un servidor web capaz de gestionar un pequeño sistema de talleres e inscripciones.
La aplicación permite consultar y filtrar los talleres, conocer las plazas disponibles y realizar inscripciones controlando los diferentes casos de error.
