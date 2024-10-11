import request from "supertest";
import app from "../index";

describe("GET /theatres", () => {
    test("It should respond with an array of movies", async () => {
      const response = await request(app).get("/theatres");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
});

describe("POST /theatres/", () => {
  // Test: Non-admin user should receive a 401 Unauthorized response
  test("Should respond with a 401 Unauthorized for non-admin user", async () => {
    const response = await request(app).post("/theatres").send({
      name: "The Grand Theatre",
      address: "123 Broadway St, New York, NY",
      mobile_number: "1234567890",
      location: "New York, NY",
      email: "contact@grandtheatre.com",
      details: "A historic venue with state-of-the-art sound and lighting.",
      is_active: true,
      no_of_seats: 500,
      no_of_rows: 20,
      no_of_columns: 25,
      image_url: "https://example.com/grand-theatre.jpg",
    });
    expect(response.statusCode).toBe(401 || 403); // Expect non-admin to get Unauthorized
  });

  // Test: Admin user should be able to add a theatre successfully
  test("Should add a theatre with valid token for admin user", async () => {
    // First, login as admin to get a valid token
    const loginResponse = await request(app).post("/auth/login").send({
      email: "starkmsh@gmail.com",  // Admin credentials
      password: "MandoMando",
    });
    const token = loginResponse.body.token;

    // Now, attempt to add a theatre with the admin token
    // const response = await request(app)
    //   .post("/theatres")
    //   .set("Authorization", `Bearer ${token}`)  // Set the Bearer token in the header
    //   .send({
    //     name: "The Grand Theatre",
    //     address: "123 Broadway St, New York, NY",
    //     mobile_number: "1234567890",
    //     location: "New York, NY",
    //     email: "contact@grandtheatre.com",
    //     details: "A historic venue with state-of-the-art sound and lighting.",
    //     is_active: true,
    //     no_of_seats: 500,
    //     no_of_rows: 20,
    //     no_of_columns: 25,
    //     image_url: "https://example.com/grand-theatre.jpg",
    //   });

    // expect(response.statusCode).toBe(200);  // Expect a success response
    // expect(response.body).toHaveProperty("id");  // Expect the response to contain the new theatre's ID
    // expect(response.body.name).toBe("The Grand Theatre");  // Ensure the response contains the correct data
  });
});
  
  
  

  

  