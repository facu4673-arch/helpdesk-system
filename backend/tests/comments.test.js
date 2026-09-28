const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

describe("Comments API", () => {

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

    test("POST /api/comments sin token debe devolver 401", async () => {

        const response = await request(app)
            .post("/api/comments")
            .send({
                ticket_id: 1,
                message: "Comentario de prueba"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body).toHaveProperty(
            "message",
            "Token no proporcionado"
        );
    });


    test("GET /api/comments/:ticketId sin token debe devolver 401", async () => {

        const response = await request(app)
            .get("/api/comments/1");

        expect(response.statusCode).toBe(401);

        expect(response.body).toHaveProperty(
            "message",
            "Token no proporcionado"
        );
    });


    test("POST /api/comments con mensaje vacío debe devolver 400", async () => {

        const response = await request(app)
            .post("/api/comments")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                ticket_id: 1,
                message: "   "
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toHaveProperty(
            "message"
        );
    });


    test("POST /api/comments con ticket inexistente debe devolver 404", async () => {

        const response = await request(app)
            .post("/api/comments")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                ticket_id: 999999,
                message: "Comentario de prueba"
            });

        expect(response.statusCode).toBe(404);

        expect(response.body).toHaveProperty(
            "message"
        );
    });


    test("GET /api/comments/:ticketId con ticket inexistente debe devolver 404", async () => {

        const response = await request(app)
            .get("/api/comments/999999")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(404);

        expect(response.body).toHaveProperty(
            "message"
        );
    });

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


    const supportOtherToken = jwt.sign(
        {
            id: 5,
            role: "support"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );


    test("POST /api/comments con usuario debe permitir comentar su propio ticket", async () => {

        const response = await request(app)
            .post("/api/comments")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                ticket_id: 13,
                message: "Comentario realizado por el usuario"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty(
            "message"
        );

        expect(response.body.comment).toHaveProperty(
            "ticket_id",
            13
        );

        expect(response.body.comment).toHaveProperty(
            "user_id",
            1
        );
    });


    test("POST /api/comments con usuario debe rechazar ticket de otro usuario", async () => {

        const response = await request(app)
            .post("/api/comments")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                ticket_id: 10,
                message: "Intento de comentario no autorizado"
            });

        expect(response.statusCode).toBe(403);

        expect(response.body).toHaveProperty(
            "message"
        );
    });


    test("POST /api/comments con support asignado debe permitir comentar el ticket", async () => {

        const response = await request(app)
            .post("/api/comments")
            .set("Authorization", `Bearer ${supportToken}`)
            .send({
                ticket_id: 8,
                message: "Comentario del soporte asignado"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty(
            "message"
        );

        expect(response.body.comment).toHaveProperty(
            "ticket_id",
            8
        );

        expect(response.body.comment).toHaveProperty(
            "user_id",
            3
        );
    });


    test("POST /api/comments con support debe permitir comentar un ticket sin asignar", async () => {

        const response = await request(app)
            .post("/api/comments")
            .set("Authorization", `Bearer ${supportToken}`)
            .send({
                ticket_id: 13,
                message: "Comentario del soporte en ticket sin asignar"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty(
            "message"
        );
    });


    test("POST /api/comments con otro support debe rechazar ticket asignado a un support diferente", async () => {

        const response = await request(app)
            .post("/api/comments")
            .set("Authorization", `Bearer ${supportOtherToken}`)
            .send({
                ticket_id: 8,
                message: "Intento de comentario de otro soporte"
            });

        expect(response.statusCode).toBe(403);

        expect(response.body).toHaveProperty(
            "message"
        );
    });


    test("POST /api/comments con admin debe permitir comentar cualquier ticket", async () => {

        const response = await request(app)
            .post("/api/comments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                ticket_id: 7,
                message: "Comentario realizado por administrador"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty(
            "message"
        );

        expect(response.body.comment).toHaveProperty(
            "ticket_id",
            7
        );

        expect(response.body.comment).toHaveProperty(
            "user_id",
            2
        );
    });

        test("GET /api/comments/:ticketId con usuario debe permitir consultar su propio ticket", async () => {

        const response = await request(app)
            .get("/api/comments/13")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

    });


    test("GET /api/comments/:ticketId con usuario debe rechazar ticket de otro usuario", async () => {

        const response = await request(app)
            .get("/api/comments/10")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(403);

        expect(response.body).toHaveProperty(
            "message"
        );

    });


    test("GET /api/comments/:ticketId con support asignado debe permitir consultar el ticket", async () => {

        const response = await request(app)
            .get("/api/comments/8")
            .set("Authorization", `Bearer ${supportToken}`);

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

    });


    test("GET /api/comments/:ticketId con support debe permitir consultar ticket sin asignar", async () => {

        const response = await request(app)
            .get("/api/comments/13")
            .set("Authorization", `Bearer ${supportToken}`);

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

    });


    test("GET /api/comments/:ticketId con otro support debe rechazar ticket asignado a otro support", async () => {

        const response = await request(app)
            .get("/api/comments/8")
            .set("Authorization", `Bearer ${supportOtherToken}`);

        expect(response.statusCode).toBe(403);

        expect(response.body).toHaveProperty(
            "message"
        );

    });


    test("GET /api/comments/:ticketId con admin debe permitir consultar cualquier ticket", async () => {

        const response = await request(app)
            .get("/api/comments/7")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

    });
});