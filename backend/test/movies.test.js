import request from "supertest";
import app from "../index";

describe("GET /movies", () => {
  test("It should respond with an array of movies", async () => {
    const response = await request(app).get("/movies");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("GET /movies/:id", () => {
  test("It should respond with a single movie for existing movieID", async () => {
    const response = await request(app).get(
      "/movies/2cc85e38-6465-11ef-9b49-f43d55f0b3b2"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("title");
  });

  test("It should respond with an empty array for invalid movieID", async () => {
    const response = await request(app).get(
      "/movies/2cc85e38-6465-11ef-9b49-f43d55f"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("POST /movies/", () => {
  test("When adding a movie it should respond with a not authorized response for non-admin user", async () => {
    const response = await request(app).post("/movies").send({
      title: "The Matrix",
      trailer_video_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      poster_url:
        "https://www.imdb.com/title/tt0133093/mediaviewer/rm4284716544/",
      overview:
        "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      released_date: "1999-03-31",
      duration: 136,
      original_language: "English",
      movie_director: "Lana Wachowski, Lilly Wachowski",
      movie_writer: "Lana Wachowski, Lilly Wachowski",
      cover_photo:
        "https://www.imdb.com/title/tt0133093/mediaviewer/rm4284716544/",
      rating: 8.7,
    });
    expect(response.statusCode).toBe(401);
  });

  test("When adding a movie it should store a valid token for admin user", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testadmin@gmail.com",
      password: "Asdf@1234",
    });
    const token = response.body.token;
    // const response2 = await request(app)
    //   .post("/movies")
    //   .set("Authorization", `Bearer ${token}`)
    //   .send({
    //     title: "The Matrix",
    //     trailer_video_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    //     poster_url:
    //       "https://www.imdb.com/title/tt0133093/mediaviewer/rm4284716544/",
    //     overview:
    //       "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    //     released_date: "1999-03-31",
    //     duration: 136,
    //     original_language: "English",
    //     movie_director: "Lana Wachowski, Lilly Wachowski",
    //     movie_writer: "Lana Wachowski, Lilly Wachowski",
    //     cover_photo:
    //       "https://www.imdb.com/title/tt0133093/mediaviewer/rm4284716544/",
    //     rating: 8.7,
    //   });
    expect(response.statusCode).toBe(200);
  });
});
