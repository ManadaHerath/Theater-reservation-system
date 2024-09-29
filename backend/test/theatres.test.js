import request from "supertest";
import app from "../index";

describe("GET /theatres", () => {
    test("It should respond with an array of movies", async () => {
      const response = await request(app).get("/theatres");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });



  
  

  
