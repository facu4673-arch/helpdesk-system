const express = require("express");

const {
    createComment,
    getTicketComments
} = require("../controllers/commentController");

const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comentarios de los tickets
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Crear un comentario en un ticket
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - ticket_id
 *             properties:
 *               message:
 *                 type: string
 *                 example: Revisamos el problema y estamos trabajando en la solución.
 *               ticket_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Comentario creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Permisos insuficientes
 */
router.post(
    "/",
    authenticateToken,
    authorizeRoles("user", "support", "admin"),
    createComment
);

/**
 * @swagger
 * /api/comments/{ticketId}:
 *   get:
 *     summary: Obtener comentarios de un ticket
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Ticket no encontrado
 */
router.get(
    "/:ticketId",
    authenticateToken,
    authorizeRoles("user", "support", "admin"),
    getTicketComments
);

module.exports = router;