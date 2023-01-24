describe("posts", () => {
  it("passes", () => {
    cy.visit("http://localhost:3001/posts");
    cy.get("h1").should("have.text", "Blog");
  });
});
