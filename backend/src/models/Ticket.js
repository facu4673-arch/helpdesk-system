const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ticket = sequelize.define(
    "Ticket",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                "ABIERTO",
                "EN_PROCESO",
                "ESPERANDO_USUARIO",
                "RESUELTO",
                "CERRADO"
            ),
            defaultValue: "ABIERTO"
        },

        priority: {
            type: DataTypes.ENUM(
                "BAJA",
                "MEDIA",
                "ALTA",
                "CRITICA"
            ),
            defaultValue: "MEDIA"
        },
        
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "tickets",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    }
);

module.exports = Ticket;