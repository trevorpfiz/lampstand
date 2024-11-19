import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: `http://localhost:8000/api/v1/openapi.json`,
  output: {
    path: "src/lib/api/client",
    format: "prettier",
    // lint: "eslint",
  },
  plugins: [
    "@tanstack/react-query",
    {
      asClass: false, // default, flat
      name: "@hey-api/services",
    },
    {
      name: "@hey-api/schemas",
      type: "json",
    },
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      enums: false, // default
      name: "@hey-api/types",
    },
  ],
});
