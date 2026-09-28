const { Comment, User, Ticket } = require("../models");

const createComment = async (req, res) => {
    try {
        const { ticket_id, message } = req.body;

        if (!ticket_id || !message) {
            return res.status(400).json({
                message: "El ticket y el mensaje son obligatorios"
            });
        }

        if (!Number.isInteger(Number(ticket_id)) || Number(ticket_id) <= 0) {
            return res.status(400).json({
                message: "El ID del ticket no es válido"
            });
        }

        const cleanMessage = message.trim();

        if (!cleanMessage) {
            return res.status(400).json({
                message: "El comentario no puede estar vacío"
            });
        }

        if (cleanMessage.length > 1000) {
            return res.status(400).json({
                message: "El comentario no puede superar los 1000 caracteres"
            });
        }

        const ticket = await Ticket.findByPk(ticket_id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket no encontrado"
            });
        }

        /*
         * USER:
         * Solo puede comentar sus propios tickets.
         */
        if (
            req.user.role === "user" &&
            ticket.user_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "No tenés permisos para comentar este ticket"
            });
        }

        /*
         * SUPPORT:
         * Puede comentar tickets asignados a él
         * o tickets que todavía no tienen soporte.
         */
        if (
            req.user.role === "support" &&
            ticket.assigned_to !== null &&
            ticket.assigned_to !== req.user.id
        ) {
            return res.status(403).json({
                message: "No tenés permisos para comentar este ticket"
            });
        }

        const comment = await Comment.create({
            ticket_id: Number(ticket_id),
            message: cleanMessage,
            user_id: req.user.id
        });

        res.status(201).json({
            message: "Comentario creado correctamente",
            comment
        });

    } catch (error) {
        console.error("Error al crear comentario:", error);

        res.status(500).json({
            message: "Error al crear el comentario"
        });
    }
};

const getTicketComments = async (req, res) => {
    try {
        const { ticketId } = req.params;

        if (
            !Number.isInteger(Number(ticketId)) ||
            Number(ticketId) <= 0
        ) {
            return res.status(400).json({
                message: "El ID del ticket no es válido"
            });
        }

        const ticket = await Ticket.findByPk(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket no encontrado"
            });
        }

        /*
         * USER:
         * Solo puede ver comentarios de sus propios tickets.
         */
        if (
            req.user.role === "user" &&
            ticket.user_id !== req.user.id
        ) {
            return res.status(403).json({
                message:
                    "No tenés permisos para ver los comentarios de este ticket"
            });
        }

        /*
         * SUPPORT:
         * Puede ver comentarios de:
         * - tickets asignados a él
         * - tickets sin asignar
         */
        if (
            req.user.role === "support" &&
            ticket.assigned_to !== null &&
            ticket.assigned_to !== req.user.id
        ) {
            return res.status(403).json({
                message:
                    "No tenés permisos para ver los comentarios de este ticket"
            });
        }

        const comments = await Comment.findAll({
            where: {
                ticket_id: Number(ticketId)
            },
            include: [
                {
                    model: User,
                    as: "author",
                    attributes: [
                        "id",
                        "name",
                        "email",
                        "role"
                    ]
                }
            ],
            order: [["created_at", "ASC"]]
        });

        res.json(comments);

    } catch (error) {
        console.error("Error al obtener comentarios:", error);

        res.status(500).json({
            message: "Error al obtener los comentarios"
        });
    }
};


module.exports = {
    createComment,
    getTicketComments
};