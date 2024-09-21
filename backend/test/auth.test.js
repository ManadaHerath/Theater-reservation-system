import request from "supertest";
import app from "../index";
import passport from "passport";

describe("POST /auth/login", () => {
  test("It should respond with a valid token when enter correct credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testadmin@gmail.com",
      password: "Asdf@1234",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});

describe("POST /auth/login", () => {
  test("It should respond with error status code when enter incorrect credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testadmin@gmail.com",
      password: "Asdf@1",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });
});

describe("POST /auth/register", () => {
  test("It should respond with error status code when enter already inserted email", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "testadmin@gmail.com",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("Email already registered");
  });
});

describe("POST /auth/register", () => {
  test("It should respond success message when enter valid details", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "testadmin123@gmail.com",
      password: "Asdf@1234",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("email");
  });
});

describe("POST /recovery/send_recovery_email", () => {
  test("It send OTP successfully when enter a valid user email", async () => {
    const response = await request(app)
      .post("/recovery/send_recovery_email")
      .send({
        email: "testadmin@gmail.com",
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /recovery/send_recovery_email", () => {
  test("It send error code when enter a invalid user email", async () => {
    const response = await request(app)
      .post("/recovery/send_recovery_email")
      .send({
        email: "testadmin89@gmail.com",
      });
    expect(response.statusCode).toBe(201);
  });
});
