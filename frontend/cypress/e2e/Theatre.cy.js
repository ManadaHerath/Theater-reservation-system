describe("Theatre Component", () => {
  it("renders theatre details correctly", () => {
    cy.intercept("GET", "/theatres/*", {
      statusCode: 200,
      body: {
        id: "1",
        name: "Cineplex",
        district: "Downtown",
        image_url: "http://example.com/image.jpg",
        details: "This is a popular theatre in the city.",
        mobile_number: "123-456-7890",
        email: "contact@cineplex.com",
        address: "123 Main St, Downtown",
        rating: 4.5,
        location: "https://www.google.com/maps/embed?pb=!1m18...",
      },
    }).as("getTheatreDetails");

    cy.visit("/theatre/1"); 

    cy.get("h1").contains("Cineplex").should("exist");
    cy.get("span").contains("Downtown").should("exist");
    cy.get("p").contains("This is a popular theatre in the city.").should("exist");
    cy.get("img").should("have.attr", "src", "http://example.com/image.jpg");
  });
});
