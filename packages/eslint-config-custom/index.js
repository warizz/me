module.exports = {
  extends: [
    "next",
    "turbo",
    "prettier",
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "prefer-template": "error",
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "error",
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
      },
    ],
    "@typescript-eslint/no-unused-vars": "error",
  },
  settings: {
    "import/resolver": { node: true, typescript: true },
  },
};
