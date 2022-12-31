describe("post", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/posts/resume");
    cy.get("h1").should("have.text", "Warizz Yutanan");
  });
});
