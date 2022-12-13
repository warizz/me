import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: "fixtures",
  supportFolder: "support",
  videosFolder: "videos",
  screenshotsFolder: "screenshots",
  experimentalWebKitSupport: true,
  e2e: {
    supportFile: "support/e2e.ts",
    baseUrl: "http://localhost:3000/",
    specPattern: "e2e/**/*.cy.{ts,tsx}",
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
  },
});
