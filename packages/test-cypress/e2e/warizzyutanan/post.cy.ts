describe("post", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/posts/resume");
    cy.get("h1").should("have.text", "Warizz Yutanan");
  });

  it("should render code blocks with syntax-highlighting", () => {
    cy.visit("http://localhost:3000/posts/dependency-injection-in-react");
    cy.get("h1").should("have.text", "Dependency Injection in React");
  });
});
