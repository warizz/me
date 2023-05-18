// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["shared"],
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  dryRun: process.env.VERCEL_ENV !== "production",
});
