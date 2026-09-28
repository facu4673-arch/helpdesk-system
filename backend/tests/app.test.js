const request = require("supertest");
const app = require("../src/app");

describe("API HelpDesk", () => {
    test("GET / debe devolver mensaje de funcionamiento", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty(
            "message",
            "API HelpDesk funcionando correctamente"
        );
    });
});