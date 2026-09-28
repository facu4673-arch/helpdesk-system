const request = require("supertest");
const app = require("../src/app");

describe("Auth API", () => {

    test("POST /api/auth/login debe rechazar credenciales incorrectas", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "usuario_que_no_existe@test.com",
                password: "123456"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body).toHaveProperty(
            "message",
            "Credenciales inválidas"
        );
    });


    test("POST /api/auth/login debe rechazar contraseña incorrecta", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "facu@test.com",
                password: "contraseña_incorrecta"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body).toHaveProperty(
            "message",
            "Credenciales inválidas"
        );
    });


    test("POST /api/auth/login debe rechazar datos incompletos", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "facu@test.com"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toHaveProperty(
            "message",
            "Email y contraseña son obligatorios"
        );
    });

    test("POST /api/auth/login debe permitir login con credenciales correctas", async () => {

    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "facu@test.com",
            password: "123456"
        });

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty(
        "message",
        "Login exitoso"
    );

    expect(response.body).toHaveProperty("token");

    expect(typeof response.body.token).toBe("string");

    expect(response.body.user).toHaveProperty("email", "facu@test.com");
    });

});