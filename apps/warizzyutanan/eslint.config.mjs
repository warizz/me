import customConfig from "eslint-config-custom";

export default [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", ".turbo/**"],
  },
  ...customConfig,
];
