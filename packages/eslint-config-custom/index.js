module.exports = {
  extends: [
    "next",
    "turbo",
    "prettier",
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "error",
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
      },
    ],
  },
  settings: {
    "import/resolver": { node: true, typescript: true },
  },
};
