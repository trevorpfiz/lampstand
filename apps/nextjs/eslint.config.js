import baseConfig, { restrictEnvAccess } from "@lamp/eslint-config/base";
import nextjsConfig from "@lamp/eslint-config/nextjs";
import reactConfig from "@lamp/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
