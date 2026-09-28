const express = require("express");

const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
    getUsers,
    createUser
} = require("../controllers/userController");

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión y consulta de usuarios
 */


/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token inválido o expirado
 */

router.get(
    "/profile",
    authenticateToken,
    (req, res) => {

        res.json({
            message: "Acceso autorizado",
            user: req.user
        });

    }
);


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Solo los administradores pueden consultar los usuarios
 */

router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    getUsers
);


/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un usuario desde el panel de administración
 *     description: Permite al administrador crear usuarios con rol user o support.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Perez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@helpdesk.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - support
 *                 example: support
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos o email ya registrado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Solo los administradores pueden crear usuarios
 *       500:
 *         description: Error interno del servidor
 */

router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    createUser
);


/**
 * @swagger
 * /api/users/admin:
 *   get:
 *     summary: Acceder al área de administración
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso autorizado para administradores
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: El usuario no tiene permisos
 */

router.get(
    "/admin",
    authenticateToken,
    authorizeRoles("admin"),
    (req, res) => {

        res.json({
            message: "Bienvenido al área de administración",
            user: req.user
        });

    }
);


module.exports = router;