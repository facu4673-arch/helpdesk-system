const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

describe("Users API - Authentication and RBAC", () => {

    test("GET /api/users/profile sin token debe devolver 401", async () => {

        const response = await request(app)
            .get("/api/users/profile");

        expect(response.statusCode).toBe(401);

        expect(response.body).toHaveProperty(
            "message",
            "Token no proporcionado"
        );
    });


    test("GET /api/users/profile con token inválido debe devolver 403", async () => {

        const response = await request(app)
            .get("/api/users/profile")
            .set("Authorization", "Bearer token_invalido");

        expect(response.statusCode).toBe(403);

        expect(response.body).toHaveProperty(
            "message",
            "Token inválido o expirado"
        );
    });

        test("GET /api/users/profile con formato de token inválido debe devolver 401", async () => {

        const response = await request(app)
            .get("/api/users/profile")
            .set("Authorization", "Token token_invalido");

        expect(response.statusCode).toBe(401);

        expect(response.body).toHaveProperty(
            "message",
            "Formato de token inválido"
        );
    });

    test("GET /api/users/profile con token válido debe devolver 200", async () => {

        const token = jwt.sign(
            {
                id: 1,
                role: "user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        const response = await request(app)
            .get("/api/users/profile")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty(
            "message",
            "Acceso autorizado"
        );

        expect(response.body.user).toHaveProperty("id", 1);
        expect(response.body.user).toHaveProperty("role", "user");
    });


    test("GET /api/users/admin con usuario normal debe devolver 403", async () => {

        const token = jwt.sign(
            {
                id: 1,
                role: "user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        const response = await request(app)
            .get("/api/users/admin")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);

        expect(response.body).toHaveProperty(
            "message",
            "No tenés permisos para realizar esta acción"
        );
    });


    test("GET /api/users/admin con usuario admin debe devolver 200", async () => {

        const token = jwt.sign(
            {
                id: 2,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        const response = await request(app)
            .get("/api/users/admin")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty(
            "message",
            "Bienvenido al área de administración"
        );

        expect(response.body.user).toHaveProperty("id", 2);
        expect(response.body.user).toHaveProperty("role", "admin");
    });

});