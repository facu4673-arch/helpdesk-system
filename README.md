# HelpDesk System

Sistema de mesa de ayuda (HelpDesk) desarrollado como proyecto de portfolio Backend Junior.

La aplicación permite gestionar tickets de soporte, usuarios, roles, asignaciones, comentarios y estados de atención mediante una API REST con autenticación JWT y un frontend desarrollado con React.

## Funcionalidades principales

* Registro e inicio de sesión de usuarios.
* Autenticación mediante JWT.
* Gestión de roles y permisos.
* Creación y consulta de tickets.
* Asignación de tickets a personal de soporte.
* Gestión del flujo de estados de los tickets.
* Sistema de comentarios asociado a tickets.
* Estadísticas de tickets.
* Paginación de tickets.
* Validación de datos.
* Control de acceso según usuario y rol.
* Documentación de la API mediante Swagger.
* Tests automatizados del backend.
* Interfaz web desarrollada con React.

## Roles

El sistema contempla tres roles principales:

| Rol           | Funciones principales                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| Usuario       | Crear tickets, consultar sus propios tickets y participar en conversaciones de soporte.                     |
| Soporte       | Consultar tickets asignados y tickets sin asignar, agregar comentarios y actualizar estados de sus tickets. |
| Administrador | Gestionar usuarios, asignaciones, tickets, estados y estadísticas generales.                                |

## Flujo de estados de tickets

```text
ABIERTO
   |
   v
EN_PROCESO
   |
   +----------------------+------------------+
   |                                         |
   v                                         v
ESPERANDO_USUARIO                         RESUELTO
   |                                         |
   |                                         v
   +------------------------------->       CERRADO

RESUELTO
   |
   +----> EN_PROCESO
```

El sistema controla las transiciones permitidas para evitar cambios de estado inválidos.

## Tecnologías utilizadas

### Backend

* Node.js
* Express
* Sequelize
* MySQL
* JWT
* bcryptjs
* Swagger
* Jest
* Supertest
* CORS
* dotenv
* Morgan

### Frontend

* React
* React Router
* Axios

## Arquitectura

El backend utiliza una estructura organizada por responsabilidades:

```text
backend/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   ├── userController.js
│   │   └── commentController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   ├── Comment.js
│   │   └── Category.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── ticket.routes.js
│   │   ├── user.routes.js
│   │   └── comment.routes.js
│   │
│   ├── swagger.js
│   └── app.js
│
├── tests/
│   ├── app.test.js
│   ├── auth.test.js
│   ├── comments.test.js
│   ├── tickets.test.js
│   └── users.test.js
│
├── server.js
├── package.json
└── .env
```

## Autenticación y autorización

La API utiliza JSON Web Tokens (JWT) para autenticar usuarios.

El token contiene información básica del usuario:

```json
{
  "id": 1,
  "role": "user"
}
```

Las rutas protegidas utilizan middleware de autenticación y autorización basada en roles.

Ejemplo:

```text
Authorization: Bearer <token>
```

El sistema diferencia entre:

* Usuario autenticado.
* Usuario no autenticado.
* Rol no autorizado.
* Token inválido o expirado.

## Paginación

La consulta de tickets permite utilizar paginación mediante parámetros:

```text
GET /api/tickets?page=1&limit=10
```

La respuesta incluye:

```json
{
  "tickets": [],
  "total": 18,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

El límite máximo permitido es de 50 tickets por página.

## Permisos de soporte

Los usuarios con rol `support` pueden consultar:

* Tickets asignados a ellos.
* Tickets que todavía no tienen soporte asignado.

No pueden consultar ni modificar tickets asignados a otro soporte.

También se aplican estas restricciones a comentarios y actualización de estados.

## Estadísticas

Los usuarios con rol `admin` y `support` pueden consultar estadísticas de tickets.

Ejemplo:

```text
GET /api/tickets/stats
```

Las estadísticas incluyen:

* Total de tickets.
* Tickets abiertos.
* Tickets en proceso.
* Tickets esperando respuesta del usuario.
* Tickets resueltos.
* Tickets cerrados.

Las estadísticas del rol `support` respetan sus permisos y consideran únicamente los tickets que puede atender.

## API REST

Principales endpoints:

### Autenticación

```text
POST /api/auth/register
POST /api/auth/login
```

### Usuarios

```text
GET /api/users/profile
GET /api/users
POST /api/users
```

### Tickets

```text
POST   /api/tickets
GET    /api/tickets
GET    /api/tickets/my
GET    /api/tickets/:id
GET    /api/tickets/stats
PATCH  /api/tickets/:id/assign
PATCH  /api/tickets/:id/status
```

### Comentarios

```text
POST /api/comments
GET  /api/comments/:ticketId
```

## Swagger

La API cuenta con documentación interactiva mediante Swagger.

Con el backend ejecutándose localmente:

```text
http://localhost:3000/api-docs
```

Desde Swagger se pueden consultar los endpoints disponibles y probar las rutas protegidas utilizando autenticación Bearer JWT.

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env`:

```env
DB_NAME=helpdesk_db
DB_USER=root
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=3306

JWT_SECRET=tu_secreto
PORT=3000
```

Iniciar el servidor en desarrollo:

```bash
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

## Tests

El backend cuenta con tests automatizados utilizando Jest y Supertest.

Para ejecutar todos los tests:

```bash
npm test
```

Resultado actual:

```text
Test Suites: 5 passed, 5 total
Tests:       42 passed, 42 total
```

Los tests cubren principalmente:

* Autenticación.
* JWT.
* Control de acceso por roles.
* Creación de tickets.
* Permisos sobre tickets.
* Paginación.
* Estadísticas.
* Flujo de estados.
* Comentarios.
* Acceso a recursos protegidos.

## Base de datos

El sistema utiliza MySQL como motor de base de datos y Sequelize como ORM.

Principales entidades:

```text
users
tickets
comments
categories
```

Relaciones principales:

```text
User 1 ───── N Ticket
User 1 ───── N Comment
Ticket 1 ─── N Comment
Category 1 ─ N Ticket
User 1 ───── N Ticket (asignados)
```

## Frontend

El proyecto incluye una interfaz web desarrollada con React.

El frontend permite:

* Inicio de sesión.
* Visualización de dashboards según rol.
* Gestión de tickets.
* Asignación de tickets.
* Actualización de estados.
* Consulta de estadísticas.
* Gestión de usuarios desde el panel administrativo.
* Visualización y creación de comentarios.

## Objetivo del proyecto

Este proyecto fue desarrollado como parte de un portfolio profesional para demostrar conocimientos en desarrollo Backend y construcción de APIs REST.

El proyecto integra autenticación, autorización basada en roles, relaciones entre entidades, validaciones, paginación, manejo de estados, estadísticas, comentarios, testing automatizado y documentación de API.

## Autor

Facundo Rodriguez

Proyecto desarrollado con fines de aprendizaje y portfolio profesional.
