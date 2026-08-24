describe("life-in-weeks", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/life-in-weeks");
  });

  it("renders the page", () => {
    cy.get("h1").should("have.text", "Life in Weeks");
    cy.get(".week-cell").its("length").should("be.greaterThan", 0);
  });

  it("highlights the current week", () => {
    cy.get("#current-week").should("exist");
  });

  it("shows life progress stats", () => {
    cy.contains("passed").should("exist");
    cy.contains("left").should("exist");
  });

  it("renders life events from data.json", () => {
    cy.get('[data-event-id="week-0001"]').should("exist");
    cy.get('[data-event-id="week-0131"]').should("exist");
    cy.get('[data-event-id="week-0132"]').should("exist");
  });

  it("opens and closes the event detail panel", () => {
    cy.get('[data-event-id="week-0001"]').first().click();

    cy.get("h2").should("have.text", "🐣 Born in 1984");
    cy.contains("Close details").click();

    cy.get("h2").should("not.exist");
  });

  it("toggles the color scheme", () => {
    cy.get("button[data-testid='color-scheme-toggle']")
      .should("have.text", "[ system ]")
      .click();

    cy.reload();
    cy.get("button[data-testid='color-scheme-toggle']")
      .should("have.text", "[ light ]")
      .click();

    cy.reload();
    cy.get("html").should("have.class", "dark");
    cy.get("button[data-testid='color-scheme-toggle']")
      .should("have.text", "[ dark ]")
      .click();

    cy.reload();
    cy.get("button[data-testid='color-scheme-toggle']").should(
      "have.text",
      "[ system ]",
    );
  });
});
