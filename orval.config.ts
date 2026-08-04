import { defineConfig } from "orval";

export default defineConfig({
  shopwave: {
    input: "http://localhost:3000/api-json",
    output: {
      target: "./src/lib/generated/api.ts",
      client: "fetch",
      mode: "single",
      override: {
        mutator: {
          path: "./src/lib/api-client.ts",
          name: "orvalFetch",
        },
        fetch: {
          // orvalFetch already resolves to the payload, so don't let orval
          // wrap the return type in a { data, status, headers } envelope.
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
});
