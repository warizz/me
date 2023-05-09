describe("home", () => {
  it("should works as expected", () => {
    cy.visit("http://localhost:3000/");
    cy.title().should("eq", "time. space. relativities.");
    cy.get("h1").should("have.text", "time. space. relativities.");
    cy.findByText("Life").should("exist");
    cy.findByText("Habit").should("exist");
    cy.findByText("Object").should("exist");
    cy.findByText("Subscription").should("exist");
    cy.findByTestId("sort-by")
      .should(($el) => {
        expect($el.get(0).innerText).to.eq("Sort by date");
      })
      .click();
    cy.findByTestId("sort-by").should(($el) => {
      expect($el.get(0).innerText).to.eq("Sort by title");
    });

    cy.findByTestId("theme")
      .should(($el) => {
        expect($el.get(0).innerText).to.eq("Theme: system-default");
      })
      .click();
    cy.findByTestId("theme")
      .should(($el) => {
        expect($el.get(0).innerText).to.eq("Theme: light");
      })
      .click();
    cy.findByTestId("theme")
      .should(($el) => {
        expect($el.get(0).innerText).to.eq("Theme: dark");
      })
      .click();
  });
});
