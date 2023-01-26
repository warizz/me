describe("posts", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/posts");
    cy.get("h1").should("have.text", "Blogs");
  });

  specify("with filter", () => {
    cy.visit("http://localhost:3000/posts?tag=git");
    cy.get("[data-testid=posts]").children().should("have.length", 3);
  });
});
