import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "9trkv4",
  fixturesFolder: "fixtures",
  supportFolder: "support",
  videosFolder: "videos",
  screenshotsFolder: "screenshots",
  experimentalWebKitSupport: true,
  e2e: {
    supportFile: "support/e2e.ts",
    specPattern: "e2e/**/*.cy.{ts,tsx}",
    video: false,
  },
});
