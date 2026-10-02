const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

describe("Tickets API", () => {

    const userToken = jwt.sign(
        {
            id: 1,
            role: "user"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    const supportToken = jwt.sign(
        {
            id: 3,
            role: "support"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    const adminToken = jwt.sign(
        {
            id: 2,
            role: "admin"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );


    test("POST /api/tickets sin token debe devolver 401", async () => {

        const response = await request(app)
            .post("/api/tickets")
            .send({
                title: "Ticket de prueba",
                description: "Descripción de prueba"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body).toHaveProperty(
            "message",
            "Token no proporcionado"
        );
    });


    test("POST /api/tickets con usuario autenticado debe crear un ticket", async () => {

        const response = await request(app)
            .post("/api/tickets")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Problema de conexión",
                description: "No puedo conectarme a la red",
                priority: "ALTA"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty(
            "message",
            "Ticket creado correctamente"
        );

        expect(response.body.ticket).toHaveProperty("title");
        expect(response.body.ticket).toHaveProperty(
            "description",
            "No puedo conectarme a la red"
        );

    });


    test("POST /api/tickets sin título debe devolver 400", async () => {

        const response = await request(app)
            .post("/api/tickets")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                description: "Ticket sin título"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toHaveProperty(
            "message",
            "Título y descripción son obligatorios"
        );
    });


    test("GET /api/tickets con usuario normal debe devolver 403", async () => {

        const response = await request(app)
            .get("/api/tickets")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(403);

        expect(response.body).toHaveProperty(
            "message",
            "No tenés permisos para realizar esta acción"
        );
    });


    test("GET /api/tickets con support debe devolver 200", async () => {

        const response = await request(app)
            .get("/api/tickets")
            .set("Authorization", `Bearer ${supportToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("tickets");
        expect(Array.isArray(response.body.tickets)).toBe(true);

        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("page", 1);
        expect(response.body).toHaveProperty("limit", 10);
        expect(response.body).toHaveProperty("totalPages");

    });


    test("GET /api/tickets con admin debe devolver 200", async () => {

        const response = await request(app)
            .get("/api/tickets")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("tickets");
        expect(Array.isArray(response.body.tickets)).toBe(true);

        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("page", 1);
        expect(response.body).toHaveProperty("limit", 10);
        expect(response.body).toHaveProperty("totalPages");

    });


    test("GET /api/tickets/stats con usuario normal debe devolver 403", async () => {

        const response = await request(app)
            .get("/api/tickets/stats")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(403);

        expect(response.body).toHaveProperty(
            "message",
            "No tenés permisos para realizar esta acción"
        );
    });


    test("GET /api/tickets/stats con support debe devolver 200", async () => {

        const response = await request(app)
            .get("/api/tickets/stats")
            .set("Authorization", `Bearer ${supportToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("abiertos");
        expect(response.body).toHaveProperty("en_proceso");
        expect(response.body).toHaveProperty("esperando_usuario");
        expect(response.body).toHaveProperty("resueltos");
        expect(response.body).toHaveProperty("cerrados");

    });


    test("GET /api/tickets/stats con admin debe devolver 200", async () => {

        const response = await request(app)
            .get("/api/tickets/stats")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("total");

    });


    test("PATCH /api/tickets/:id/status sin permiso debe devolver 403", async () => {

        const response = await request(app)
            .patch("/api/tickets/1/status")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                status: "EN_PROCESO"
            });

        expect(response.statusCode).toBe(403);

        expect(response.body).toHaveProperty(
            "message",
            "No tenés permisos para realizar esta acción"
        );
    });


    test("PATCH /api/tickets/:id/status con estado inválido debe devolver 400", async () => {

        const response = await request(app)
            .patch("/api/tickets/1/status")
            .set("Authorization", `Bearer ${supportToken}`)
            .send({
                status: "ESTADO_INVENTADO"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toHaveProperty(
            "message",
            "Estado inválido"
        );

    });

        test("GET /api/tickets debe respetar la paginación", async () => {

        const response = await request(app)
            .get("/api/tickets?page=1&limit=2")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(2);
        expect(response.body.tickets.length).toBeLessThanOrEqual(2);
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("totalPages");

    });


    test("GET /api/tickets debe permitir consultar una segunda página", async () => {

        const firstPage = await request(app)
            .get("/api/tickets?page=1&limit=2")
            .set("Authorization", `Bearer ${adminToken}`);

        const secondPage = await request(app)
            .get("/api/tickets?page=2&limit=2")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(firstPage.statusCode).toBe(200);
        expect(secondPage.statusCode).toBe(200);

        expect(secondPage.body.page).toBe(2);
        expect(secondPage.body.limit).toBe(2);

        if (
            firstPage.body.tickets.length > 0 &&
            secondPage.body.tickets.length > 0
        ) {
            expect(secondPage.body.tickets[0].id)
                .not
                .toBe(firstPage.body.tickets[0].id);
        }

    });


    test("GET /api/tickets debe limitar page y limit a valores válidos", async () => {

        const response = await request(app)
            .get("/api/tickets?page=0&limit=100")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(50);

    });

});