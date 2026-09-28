# HelpDesk System

Sistema de mesa de ayuda (HelpDesk) desarrollado como proyecto de portfolio Backend Junior.

La aplicación permite gestionar tickets de soporte, usuarios, roles, asignaciones, comentarios y estados de atención mediante una API REST con autenticación JWT y un frontend desarrollado con React.

## Funcionalidades principales

- Registro e inicio de sesión de usuarios.
- Autenticación mediante JWT.
- Gestión de roles y permisos.
- Creación y consulta de tickets.
- Asignación de tickets a personal de soporte.
- Gestión del flujo de estados de los tickets.
- Sistema de comentarios asociado a tickets.
- Estadísticas generales de tickets.
- Validación de datos.
- Control de acceso según usuario y rol.
- Documentación de la API mediante Swagger.
- Tests automatizados del backend.
- Interfaz web desarrollada con React.

## Roles

El sistema contempla tres roles principales:

| Rol | Funciones principales |
|---|---|
| Usuario | Crear tickets, consultar sus tickets y participar en conversaciones de soporte. |
| Soporte | Consultar tickets, atender tickets asignados y actualizar estados. |
| Administrador | Gestionar usuarios, asignaciones, tickets y estadísticas. |

## Flujo de estados de tickets

```text
ABIERTO
   |
   v
EN_PROCESO
   |
   +----------------------+
   |                      |
   v                      v
ESPERANDO_USUARIO      RESUELTO
   |                      |
   |                      v
   +------------->      CERRADO