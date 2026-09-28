const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "HelpDesk API",
            version: "1.0.0",
            description: "API REST para la gestión de tickets de soporte"
        },

        servers: [
            {
                url: "http://localhost:3000"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: [
        "./src/routes/auth.routes.js",
        "./src/routes/user.routes.js",
        "./src/routes/ticket.routes.js",
        "./src/routes/comment.routes.js"
    ],

    failOnErrors: true
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;