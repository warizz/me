import { withSentryConfig } from "@sentry/nextjs";

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["shared"],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default withSentryConfig(nextConfig, {
  silent: true, // Suppresses all logs
  dryRun: process.env.VERCEL_ENV !== "production",
});
