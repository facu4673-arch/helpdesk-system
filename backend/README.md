# API REST HelpDesk

API REST para la gestion de tickets de soporte tecnico, desarrollada con Node.js y Express.

El sistema permite gestionar usuarios, autenticacion, roles y permisos, tickets de soporte, asignacion de tickets, estados, comentarios y estadisticas.

El proyecto fue desarrollado como parte de un portfolio orientado a Backend Junior, aplicando autenticacion mediante JWT, autorizacion basada en roles, ORM con Sequelize, documentacion con Swagger y pruebas automatizadas.

---

## Funcionalidades

* Registro e inicio de sesion de usuarios.
* Autenticacion mediante JWT.
* Autorizacion basada en roles (RBAC).
* Gestion de usuarios.
* Creacion y consulta de tickets.
* Asignacion de tickets a personal de soporte.
* Gestion controlada del estado de los tickets.
* Sistema de comentarios sobre tickets.
* Control de acceso segun usuario, soporte y administrador.
* Estadisticas generales de tickets.
* Validacion de datos.
* Contrasenas protegidas mediante bcrypt.
* Documentacion interactiva con Swagger.
* Pruebas automatizadas con Jest y Supertest.

---

## Roles

El sistema cuenta con tres roles principales:

| Rol       | Permisos principales                                                                        |
| --------- | ------------------------------------------------------------------------------------------- |
| `user`    | Crear tickets, consultar sus propios tickets y agregar/consultar comentarios en sus tickets |
| `support` | Consultar tickets, gestionar tickets asignados y trabajar con comentarios                   |
| `admin`   | Acceso administrativo, asignacion de tickets y gestion general                              |

La autorizacion se implementa mediante middleware y controla el acceso a los diferentes endpoints de la API.

---

## Flujo de estados de los tickets

Los tickets siguen un flujo de estados controlado para evitar transiciones invalidas:

```text
ABIERTO
   |
   v
EN_PROCESO
   |--------------------> RESUELTO
   |
   v
ESPERANDO_USUARIO
   |
   +--------------------> EN_PROCESO
```

Desde `RESUELTO` se puede pasar a:

```text
RESUELTO
   |------> CERRADO
   |
   +------> EN_PROCESO
```

Un ticket en estado `CERRADO` no puede volver a modificarse mediante el flujo normal de estados.

---

## Tecnologias utilizadas

### Backend

* Node.js
* Express
* Sequelize
* MySQL
* MySQL2
* JWT (JSON Web Token)
* bcryptjs
* CORS
* dotenv

### Documentacion

* Swagger
* swagger-jsdoc
* swagger-ui-express

### Testing

* Jest
* Supertest

### Desarrollo

* Nodemon

---

## Estructura del proyecto

```text
backend/
|
+-- src/
|   |
|   +-- config/
|   |   +-- database.js
|   |
|   +-- controllers/
|   |   +-- authController.js
|   |   +-- commentController.js
|   |   +-- ticketController.js
|   |   +-- userController.js
|   |
|   +-- middlewares/
|   |   +-- authMiddleware.js
|   |   +-- roleMiddleware.js
|   |
|   +-- models/
|   |   +-- Category.js
|   |   +-- Comment.js
|   |   +-- Ticket.js
|   |   +-- User.js
|   |   +-- index.js
|   |
|   +-- routes/
|   |   +-- auth.routes.js
|   |   +-- comment.routes.js
|   |   +-- ticket.routes.js
|   |   +-- user.routes.js
|   |
|   +-- app.js
|   +-- swagger.js
|
+-- tests/
|   +-- app.test.js
|   +-- auth.test.js
|   +-- comments.test.js
|   +-- tickets.test.js
|   +-- users.test.js
|
+-- .env
+-- .gitignore
+-- jest.setup.js
+-- package.json
+-- server.js
+-- README.md
```

---

## Autenticacion

La API utiliza JWT para autenticar a los usuarios.

Despues de iniciar sesion correctamente, el servidor devuelve un token que debe enviarse en las rutas protegidas mediante el header:

```http
Authorization: Bearer <token>
```

Las contrasenas son almacenadas utilizando hashes generados con `bcryptjs`.

---

## Endpoints principales

### Autenticacion

| Metodo | Endpoint             | Descripcion       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Registrar usuario |
| POST   | `/api/auth/login`    | Iniciar sesion    |

### Usuarios

| Metodo | Endpoint             | Descripcion                            |
| ------ | -------------------- | -------------------------------------- |
| GET    | `/api/users/profile` | Obtener perfil del usuario autenticado |
| GET    | `/api/users`         | Consultar usuarios segun permisos      |

### Tickets

| Metodo | Endpoint                  | Descripcion                 |
| ------ | ------------------------- | --------------------------- |
| POST   | `/api/tickets`            | Crear ticket                |
| GET    | `/api/tickets/my`         | Obtener tickets del usuario |
| GET    | `/api/tickets`            | Obtener tickets generales   |
| GET    | `/api/tickets/stats`      | Obtener estadisticas        |
| GET    | `/api/tickets/:id`        | Obtener ticket por ID       |
| PATCH  | `/api/tickets/:id/assign` | Asignar ticket              |
| PATCH  | `/api/tickets/:id/status` | Actualizar estado           |

### Comentarios

| Metodo | Endpoint                  | Descripcion                      |
| ------ | ------------------------- | -------------------------------- |
| POST   | `/api/comments`           | Crear comentario                 |
| GET    | `/api/comments/:ticketId` | Obtener comentarios de un ticket |

Los endpoints protegidos requieren autenticacion y algunos requieren determinados roles.

---

## Estadisticas

El sistema cuenta con un endpoint para consultar estadisticas generales de tickets:

```http
GET /api/tickets/stats
```

La respuesta incluye informacion como:

* Total de tickets.
* Tickets abiertos.
* Tickets en proceso.
* Tickets esperando respuesta del usuario.
* Tickets resueltos.
* Tickets cerrados.

---

## Documentacion de la API

La API cuenta con documentacion interactiva mediante Swagger.

Con el servidor iniciado, acceder a:

```text
http://localhost:3000/api-docs
```

Desde Swagger se pueden consultar los endpoints disponibles y probar las solicitudes de la API.

---

## Instalacion

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

### 2. Entrar al backend

```bash
cd backend
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear un archivo `.env` en la raiz del backend:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=helpdesk_db
PORT=3000
JWT_SECRET=tu_secreto
```

No se deben subir las credenciales ni el archivo `.env` al repositorio.

---

## Ejecutar el proyecto

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor normalmente:

```bash
npm start
```

La API estara disponible en:

```text
http://localhost:3000
```

---

## Pruebas automatizadas

El proyecto cuenta con pruebas automatizadas utilizando Jest y Supertest.

Ejecutar:

```bash
npm test
```

Estado actual de las pruebas:

```text
Test Suites: 5 passed, 5 total
Tests:       39 passed, 39 total
```

Las pruebas cubren diferentes aspectos de la API, incluyendo:

* Autenticacion.
* Usuarios.
* Roles y permisos.
* Tickets.
* Estados de tickets.
* Comentarios.
* Acceso autorizado y no autorizado.
* Validaciones.

---

## Arquitectura

El backend utiliza una organizacion basada en responsabilidades:

* **Routes:** definicion de endpoints.
* **Controllers:** logica relacionada con las solicitudes HTTP.
* **Models:** definicion de entidades y relaciones mediante Sequelize.
* **Middlewares:** autenticacion y autorizacion.
* **Config:** configuracion de conexion con la base de datos.
* **Tests:** pruebas automatizadas de los endpoints.

Esta separacion permite mantener el codigo organizado y facilitar su mantenimiento y evolucion.

---

## Objetivo del proyecto

El objetivo del proyecto es desarrollar una API REST de HelpDesk aplicando conceptos y herramientas utilizados habitualmente en el desarrollo backend:

* Diseno de APIs REST.
* Autenticacion y autorizacion.
* Manejo de roles y permisos.
* Persistencia de datos relacional.
* ORM.
* Middleware.
* Validacion de informacion.
* Manejo de estados.
* Documentacion de APIs.
* Testing automatizado.
* Organizacion modular del backend.

El proyecto forma parte de un portfolio de desarrollo Backend Junior.

