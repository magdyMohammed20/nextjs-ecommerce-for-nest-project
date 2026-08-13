import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      thresholds: {
        lines: 80,
        statements: 70,
      },
      exclude: [
        "src/**/*.stories.tsx",
        "src/lib/generated/**",
        "src/test-utils/**",
        "src/test/**",
        "src/features/_template/**",
        "next-env.d.ts",
        "**/*.config.*",
      ],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
