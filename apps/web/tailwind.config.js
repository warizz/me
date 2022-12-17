// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      colors: {
        primary: colors.amber["500"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-headings": colors.gray["700"],
            "--tw-prose-bullets": colors.amber["500"],
            "--tw-prose-links": colors.amber["500"],
            "--tw-prose-invert-headings": colors.amber["500"],
            "--tw-prose-invert-bullets": colors.amber["500"],
            "--tw-prose-invert-body": colors.gray["200"],
            "--tw-prose-invert-pre-code": colors.gray["700"],
            "--tw-prose-invert-pre-bg": colors.amber["100"],
            "--tw-prose-invert-links": colors.amber["500"],
          },
        },
      },
    },
  },
};
