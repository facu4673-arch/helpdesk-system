const { User } = require("../models");

const bcrypt = require("bcryptjs");


// =====================================================
// OBTENER TODOS LOS USUARIOS
// =====================================================

const getUsers = async (req, res) => {
    try {

        const users = await User.findAll({
            attributes: [
                "id",
                "name",
                "email",
                "role",
                "created_at"
            ],
            order: [
                ["id", "ASC"]
            ]
        });

        res.json(users);

    } catch (error) {

        console.error("Error al obtener usuarios:", error);

        res.status(500).json({
            message: "Error al obtener los usuarios"
        });

    }
};


// =====================================================
// CREAR USUARIO DESDE ADMIN
// =====================================================

const createUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        // ---------------------------------------------
        // VALIDAR CAMPOS OBLIGATORIOS
        // ---------------------------------------------

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Nombre, email y contraseña son obligatorios"
            });
        }


        // ---------------------------------------------
        // VALIDAR ROL
        // ---------------------------------------------

        if (role && !["user", "support"].includes(role)) {
            return res.status(400).json({
                message: "El rol debe ser user o support"
            });
        }


        // ---------------------------------------------
        // VERIFICAR EMAIL EXISTENTE
        // ---------------------------------------------

        const existingUser = await User.findOne({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "El email ya está registrado"
            });
        }


        // ---------------------------------------------
        // HASHEAR CONTRASEÑA
        // ---------------------------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // ---------------------------------------------
        // CREAR USUARIO
        // ---------------------------------------------

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user"
        });


        // ---------------------------------------------
        // RESPUESTA
        // ---------------------------------------------

        res.status(201).json({
            message: "Usuario creado correctamente",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }
        });

    } catch (error) {

        console.error("Error al crear usuario:", error);

        res.status(500).json({
            message: "Error al crear el usuario"
        });

    }
};


module.exports = {
    getUsers,
    createUser
};