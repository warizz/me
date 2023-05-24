describe("homepage", () => {
  specify("Render", () => {
    cy.visit("http://localhost:3002/");

    // GA should be disabled in testing
    cy.get("script#ga_lib").should("not.exist");
    cy.get("script#ga_datalayer").should("not.exist");

    cy.get("h1").should("have.text", "time. space. relativities.");
  });
});
