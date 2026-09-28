const User = require("./User");
const Ticket = require("./Ticket");
const Comment = require("./Comment");
const Category = require("./Category");

// Usuario que crea el ticket
User.hasMany(Ticket, {
    foreignKey: "user_id",
    as: "createdTickets"
});

Ticket.belongsTo(User, {
    foreignKey: "user_id",
    as: "creator"
});

// Usuario de soporte asignado al ticket
User.hasMany(Ticket, {
    foreignKey: "assigned_to",
    as: "assignedTickets"
});

Ticket.belongsTo(User, {
    foreignKey: "assigned_to",
    as: "assignedSupport"
});

// Ticket y comentarios
Ticket.hasMany(Comment, {
    foreignKey: "ticket_id",
    as: "comments"
});

Comment.belongsTo(Ticket, {
    foreignKey: "ticket_id",
    as: "ticket"
});

// Usuario y comentarios
User.hasMany(Comment, {
    foreignKey: "user_id",
    as: "comments"
});

Comment.belongsTo(User, {
    foreignKey: "user_id",
    as: "author"
});

// Categorías y tickets
Category.hasMany(Ticket, {
    foreignKey: "category_id",
    as: "tickets"
});

Ticket.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category"
});

module.exports = {
    User,
    Ticket,
    Comment,
    Category
};