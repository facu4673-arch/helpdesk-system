const { User } = require("../models");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =====================================================
// REGISTRO
// =====================================================

const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Validar campos

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Nombre, email y contraseña son obligatorios"
            });

        }


        // Verificar email existente

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


        // Hashear contraseña

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Crear usuario

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });


        // Respuesta

        res.status(201).json({

            message: "Usuario registrado correctamente",

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "Error en registro:",
            error
        );

        res.status(500).json({
            message: "Error al registrar usuario"
        });

    }
};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Validar campos

        if (!email || !password) {

            return res.status(400).json({
                message: "Email y contraseña son obligatorios"
            });

        }


        // Buscar usuario

        const user = await User.findOne({
            where: {
                email
            }
        });


        if (!user) {

            return res.status(401).json({
                message: "Credenciales inválidas"
            });

        }


        // Comparar contraseña

        const passwordValid = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordValid) {

            return res.status(401).json({
                message: "Credenciales inválidas"
            });

        }


        // Crear JWT

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );


        // Respuesta

        res.json({

            message: "Login exitoso",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "Error en login:",
            error
        );

        res.status(500).json({
            message: "Error al iniciar sesión"
        });

    }
};


module.exports = {
    register,
    login
};