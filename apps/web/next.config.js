// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextJsConfig = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ["ui"],
  },
};

module.exports = nextJsConfig;
