const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define(
    "Comment",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "comments",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    }
);

module.exports = Comment;