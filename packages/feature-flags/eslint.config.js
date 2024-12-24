import baseConfig from "@lamp/eslint-config/base";
import nextjsConfig from "@lamp/eslint-config/nextjs";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...nextjsConfig,
];
