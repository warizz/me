import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import turboPlugin from "eslint-plugin-turbo";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
      turbo: turboPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
      react: reactPlugin,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      "import/resolver": {
        node: true,
        typescript: true,
      },
      react: {
        version: "detect",
      },
    },
    rules: {
      ...prettierConfig.rules,
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
      "prettier/prettier": "error",
    },
  },
];
