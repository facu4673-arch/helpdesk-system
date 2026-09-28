const express = require("express");

const {
    createTicket,
    getMyTickets,
    getAllTickets,
    assignTicket,
    updateTicketStatus,
    getTicketStats,
    getTicketById
} = require("../controllers/ticketController");

const authenticateToken =
    require("../middlewares/authMiddleware");

const authorizeRoles =
    require("../middlewares/roleMiddleware");

const router = express.Router();


// =====================================================
// SWAGGER
// =====================================================

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Gestión de tickets de soporte
 */


// =====================================================
// CREAR TICKET
// =====================================================

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Crear un nuevo ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */

router.post(
    "/",
    authenticateToken,
    authorizeRoles("user"),
    createTicket
);


// =====================================================
// MIS TICKETS
// =====================================================

/**
 * @swagger
 * /api/tickets/my:
 *   get:
 *     summary: Obtener los tickets del usuario autenticado
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */

router.get(
    "/my",
    authenticateToken,
    authorizeRoles("user"),
    getMyTickets
);


// =====================================================
// TODOS LOS TICKETS
// ADMIN + SUPPORT
// =====================================================

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Obtener todos los tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */

router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "support"),
    getAllTickets
);


// =====================================================
// ESTADÍSTICAS
// ADMIN + SUPPORT
// =====================================================

/**
 * @swagger
 * /api/tickets/stats:
 *   get:
 *     summary: Obtener estadísticas de tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */

router.get(
    "/stats",
    authenticateToken,
    authorizeRoles("admin", "support"),
    getTicketStats
);


// =====================================================
// ASIGNAR TICKET
// SOLO ADMIN
// =====================================================

/**
 * @swagger
 * /api/tickets/{id}/assign:
 *   patch:
 *     summary: Asignar un ticket a un usuario de soporte
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */

router.patch(
    "/:id/assign",
    authenticateToken,
    authorizeRoles("admin"),
    assignTicket
);


// =====================================================
// CAMBIAR ESTADO
// ADMIN + SUPPORT
// =====================================================

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   patch:
 *     summary: Cambiar el estado de un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */

router.patch(
    "/:id/status",
    authenticateToken,
    authorizeRoles("admin", "support"),
    updateTicketStatus
);


// =====================================================
// OBTENER TICKET POR ID
// USER + SUPPORT + ADMIN
// =====================================================

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Obtener un ticket por ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles(
        "user",
        "support",
        "admin"
    ),
    getTicketById
);


module.exports = router;