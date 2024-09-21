import request from "supertest";
import app from "../index";

describe("GET /reviews/:id", () => {
  test("It should respond with a array when enter correct theatre_id", async () => {
    const response = await request(app).get(
      "/reviews/08b22b31-5f9f-11ef-9b49-f43d55f0b3b2"
    );
    expect(response.body).toBeInstanceOf(Array);
    expect(response.statusCode).toBe(200);
  });
});

describe("PATCH /like", () => {
  test("It should respond with success status code when enter correct review_id", async () => {
    const response = await request(app).patch("/reviews/like").send({
      id: "08b22b31-5f9f-11ef-9b49-f43d55f0b3b2",
    });
    expect(response.statusCode).toBe(201);
  });
});
