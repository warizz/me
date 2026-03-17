import customConfig from "eslint-config-custom";

export default [
  ...customConfig,
  {
    ignores: [".next/**", "node_modules/**"],
  },
];
