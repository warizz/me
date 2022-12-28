// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/shared/**/*.{ts,tsx}",
  ],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      colors: {
        primary: colors.pink["800"],
        "primary-invert": colors.pink["500"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-headings": colors.pink["800"],
            "--tw-prose-counters": colors.pink["800"],
            "--tw-prose-bullets": colors.pink["800"],
            "--tw-prose-links": colors.pink["800"],
            "--tw-prose-invert-headings": colors.pink["500"],
            "--tw-prose-invert-counters": colors.pink["500"],
            "--tw-prose-invert-bullets": colors.pink["500"],
            "--tw-prose-invert-body": colors.gray["200"],
            "--tw-prose-invert-pre-code": colors.gray["700"],
            "--tw-prose-invert-pre-bg": colors.pink["100"],
            "--tw-prose-invert-links": colors.pink["500"],
          },
        },
      },
    },
  },
};
