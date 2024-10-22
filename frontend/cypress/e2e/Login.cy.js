
describe("Login Page Test", () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit("/login"); // Adjust the path according to your routing
  });

  it("Should display login form correctly", () => {
    cy.get("h1").contains("Login Now");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Login");
    cy.get("a").contains("Forgot Password?").should("be.visible");
    cy.get("a").contains("Register").should("be.visible");
  });

  it("Should allow typing in email and password fields", () => {
    cy.get('input[name="email"]')
      .type("user@example.com")
      .should("have.value", "user@example.com");

    cy.get('input[name="password"]')
      .type("password123")
      .should("have.value", "password123");
  });

  it("Should toggle password visibility", () => {
    cy.get('input[name="password"]').type("password123");

    // Initially, password should be hidden
    cy.get('input[name="password"]').should("have.attr", "type", "password");


  });

  it("Should show error message on invalid login", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 203, // Simulating unauthorized login
      body: { message: "Invalid credentials" },
    });

    cy.get('input[name="email"]').type("wrong@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.get(".MuiAlert-message").contains("Invalid credentials");
  });

});
