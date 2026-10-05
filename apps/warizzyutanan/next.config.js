/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // inline the page's CSS into the HTML at build time; removes the
    // render-blocking stylesheet requests (Lighthouse "Eliminate render-blocking
    // resources"). Next 16 app-router replacement for the old optimizeCss/critters.
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            // ponytail: add `; preload` only after submitting to hstspreload.org — it's permanent
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

// oxlint-disable-next-line typescript/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
