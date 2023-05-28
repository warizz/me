describe("homepage", () => {
  specify("Render", () => {
    cy.visit("http://localhost:3002/movies/2023");

    // GA should be disabled in testing
    cy.get("script#ga_lib").should("not.exist");
    cy.get("script#ga_datalayer").should("not.exist");

    cy.get("h1").should("have.text", "2023 Movies");

    cy.get("#movies img").should("have.length.at.least", 5);
  });

  specify("Sorting", () => {
    cy.visit("http://localhost:3002/movies/2023");

    cy.get("button[data-testid='sort-by']")
      .should("have.text", "Sort by date dsc")
      .click();

    cy.get("button[data-testid='sort-by']")
      .should("have.text", "Sort by date asc")
      .click();
  });
});
