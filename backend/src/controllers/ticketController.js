const {
    Ticket,
    User,
    Category
} = require("../models");

const { Op } = require("sequelize");

// =====================================================
// CREAR TICKET
// =====================================================

const createTicket = async (req, res) => {

    try {

        const {
            title,
            description,
            priority,
            category_id
        } = req.body;


        if (
            !title ||
            !description ||
            !title.trim() ||
            !description.trim()
        ) {

            return res.status(400).json({
                message: "Título y descripción son obligatorios"
            });

        }

        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        const allowedPriorities = [
            "BAJA",
            "MEDIA",
            "ALTA",
            "CRITICA"
        ];


        if (
            priority &&
            !allowedPriorities.includes(priority)
        ) {

            return res.status(400).json({
                message: "Prioridad inválida"
            });

        }


        if (category_id) {

            const category = await Category.findByPk(
                category_id
            );

            if (!category) {

                return res.status(400).json({
                    message: "La categoría seleccionada no existe"
                });

            }

        }


        const ticket = await Ticket.create({
            title: cleanTitle,
            description: cleanDescription,

            priority: priority || "MEDIA",

            category_id: category_id || null,

            user_id: req.user.id
        });


        res.status(201).json({

            message: "Ticket creado correctamente",

            ticket

        });


    } catch (error) {

        console.error(
            "Error al crear ticket:",
            error
        );

        res.status(500).json({
            message: "Error al crear el ticket"
        });

    }

};


// =====================================================
// OBTENER MIS TICKETS
// =====================================================

const getMyTickets = async (req, res) => {

    try {

        const tickets = await Ticket.findAll({

            where: {
                user_id: req.user.id
            },

            include: [

                {
                    model: Category,
                    as: "category"
                }

            ],

            order: [
                ["created_at", "DESC"]
            ]

        });


        res.json(tickets);


    } catch (error) {

        console.error(
            "Error al obtener tickets:",
            error
        );

        res.status(500).json({
            message: "Error al obtener los tickets"
        });

    }

};


// =====================================================
// OBTENER TODOS LOS TICKETS
// =====================================================

const getAllTickets = async (req, res) => {
    try {
        let where = {};

        // Si es SUPPORT, solo puede recibir:
        // 1. Tickets asignados a él
        // 2. Tickets que todavía no tienen soporte asignado
        if (req.user.role === "support") {
            where = {
                [Op.or]: [
                    {
                        assigned_to: req.user.id
                    },
                    {
                        assigned_to: null
                    }
                ]
            };
        }

        const tickets = await Ticket.findAll({
            where,
            include: [
                {
                    model: Category,
                    as: "category"
                },
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "name", "email"]
                },
                {
                    model: User,
                    as: "assignedSupport",
                    attributes: ["id", "name", "email"]
                }
            ],
            order: [["created_at", "DESC"]]
        });

        res.json(tickets);

    } catch (error) {
        console.error("Error al obtener tickets:", error);

        res.status(500).json({
            message: "Error al obtener tickets"
        });
    }
};

// =====================================================
// ASIGNAR TICKET
// SOLO ADMIN
// =====================================================

const assignTicket = async (req, res) => {

    try {

        const { id } = req.params;

        const { assigned_to } = req.body;


        if (!assigned_to) {

            return res.status(400).json({
                message: "Debés indicar el usuario de soporte"
            });

        }


        const ticket = await Ticket.findByPk(id);


        if (!ticket) {

            return res.status(404).json({
                message: "Ticket no encontrado"
            });

        }


        const supportUser =
            await User.findByPk(assigned_to);


        if (!supportUser) {

            return res.status(404).json({
                message: "Usuario de soporte no encontrado"
            });

        }


        if (supportUser.role !== "support") {

            return res.status(400).json({
                message:
                    "El usuario seleccionado no tiene rol de soporte"
            });

        }


        ticket.assigned_to = supportUser.id;


        await ticket.save();


        res.json({

            message:
                "Ticket asignado correctamente",

            ticket

        });


    } catch (error) {

        console.error(
            "Error al asignar ticket:",
            error
        );

        res.status(500).json({
            message: "Error al asignar el ticket"
        });

    }

};


// =====================================================
// ACTUALIZAR ESTADO DEL TICKET
// ADMIN + SUPPORT
// =====================================================

const updateTicketStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;


        const allowedStatuses = [

            "ABIERTO",

            "EN_PROCESO",

            "ESPERANDO_USUARIO",

            "RESUELTO",

            "CERRADO"

        ];


        if (!status) {

            return res.status(400).json({
                message: "Debés indicar el estado"
            });

        }


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: "Estado inválido"
            });

        }


        const ticket =
            await Ticket.findByPk(id);


        if (!ticket) {

            return res.status(404).json({
                message: "Ticket no encontrado"
            });

        }


        // -------------------------------------------------
        // SEGURIDAD:
        // SUPPORT SOLO PUEDE MODIFICAR SUS TICKETS
        // -------------------------------------------------

        if (req.user.role === "support") {

            if (
                ticket.assigned_to !== req.user.id
            ) {

                return res.status(403).json({

                    message:
                        "Solo podés modificar tickets asignados a vos"

                });

            }

        }


        // -------------------------------------------------
        // TRANSICIONES PERMITIDAS
        // -------------------------------------------------

        const validTransitions = {

            ABIERTO: [
                "EN_PROCESO"
            ],

            EN_PROCESO: [
                "ESPERANDO_USUARIO",
                "RESUELTO"
            ],

            ESPERANDO_USUARIO: [
                "EN_PROCESO",
                "RESUELTO"
            ],

            RESUELTO: [
                "CERRADO",
                "EN_PROCESO"
            ],

            CERRADO: []

        };


        if (
            !validTransitions[ticket.status]
                .includes(status)
        ) {

            return res.status(400).json({

                message:
                    `No se puede cambiar el estado de ${ticket.status} a ${status}`

            });

        }


        ticket.status = status;


        await ticket.save();


        res.json({

            message:
                "Estado del ticket actualizado correctamente",

            ticket

        });


    } catch (error) {

        console.error(
            "Error al actualizar estado:",
            error
        );

        res.status(500).json({
            message:
                "Error al actualizar el estado del ticket"
        });

    }

};


// =====================================================
// ESTADÍSTICAS
// =====================================================

const getTicketStats = async (req, res) => {
    try {
        let where = {};

        /*
         * SUPPORT:
         * Solo obtiene estadísticas de:
         * - tickets asignados a él
         * - tickets sin asignar
         */
        if (req.user.role === "support") {
            where = {
                [Op.or]: [
                    {
                        assigned_to: req.user.id
                    },
                    {
                        assigned_to: null
                    }
                ]
            };
        }

        const tickets = await Ticket.findAll({
            where,
            attributes: ["status"]
        });

        const stats = {
            total: tickets.length,
            abiertos: 0,
            en_proceso: 0,
            esperando_usuario: 0,
            resueltos: 0,
            cerrados: 0
        };

        tickets.forEach((ticket) => {
            switch (ticket.status) {
                case "ABIERTO":
                    stats.abiertos++;
                    break;

                case "EN_PROCESO":
                    stats.en_proceso++;
                    break;

                case "ESPERANDO_USUARIO":
                    stats.esperando_usuario++;
                    break;

                case "RESUELTO":
                    stats.resueltos++;
                    break;

                case "CERRADO":
                    stats.cerrados++;
                    break;
            }
        });

        res.json(stats);

    } catch (error) {
        console.error("Error al obtener estadísticas:", error);

        res.status(500).json({
            message: "Error al obtener estadísticas"
        });
    }
};

// =====================================================
// OBTENER TICKET POR ID
// =====================================================

const getTicketById = async (req, res) => {

    try {

        const { id } = req.params;


        const ticket =
            await Ticket.findByPk(id, {

                include: [

                    {
                        model: User,

                        as: "creator",

                        attributes: [
                            "id",
                            "name",
                            "email",
                            "role"
                        ]
                    },

                    {
                        model: User,

                        as: "assignedSupport",

                        attributes: [
                            "id",
                            "name",
                            "email",
                            "role"
                        ]
                    },

                    {
                        model: Category,

                        as: "category"
                    }

                ]

            });


        if (!ticket) {

            return res.status(404).json({
                message: "Ticket no encontrado"
            });

        }


        // -------------------------------------------------
        // USER:
        // SOLO PUEDE VER SUS PROPIOS TICKETS
        // -------------------------------------------------

        if (
            req.user.role === "user" &&
            ticket.user_id !== req.user.id
        ) {

            return res.status(403).json({

                message:
                    "No tenés permisos para ver este ticket"

            });

        }


        // -------------------------------------------------
        // SUPPORT:
        // PUEDE VER:
        // - tickets asignados a él
        // - tickets todavía sin asignar
        //
        // NO puede ver tickets asignados a otro soporte
        // -------------------------------------------------

        if (
            req.user.role === "support" &&
            ticket.assigned_to !== null &&
            ticket.assigned_to !== req.user.id
        ) {

            return res.status(403).json({

                message:
                    "No tenés permisos para ver este ticket"

            });

        }


        res.json(ticket);


    } catch (error) {

        console.error(
            "Error al obtener ticket:",
            error
        );

        res.status(500).json({

            message:
                "Error al obtener el ticket"

        });

    }

};


module.exports = {

    createTicket,

    getMyTickets,

    getAllTickets,

    assignTicket,

    updateTicketStatus,

    getTicketStats,

    getTicketById

};