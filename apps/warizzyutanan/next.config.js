// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true, // Suppresses all logs
  dryRun: process.env.VERCEL_ENV !== "production",
});
