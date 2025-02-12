// eslint-disable-next-line @typescript-eslint/no-var-requires, import/order
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

// eslint-disable-next-line @typescript-eslint/no-var-requires, import/order
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(
  withSentryConfig(nextConfig, {
    silent: true, // Suppresses all logs
    dryRun: process.env.VERCEL_ENV !== "production",
  }),
);
