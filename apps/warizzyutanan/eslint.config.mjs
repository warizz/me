import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import customConfig from "eslint-config-custom";

export default [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", ".turbo/**"],
  },
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...customConfig,
];
