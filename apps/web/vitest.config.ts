import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    coverage: {
      reporter: ["text", "lcov"],
      include: ["lib/**", "app/api/**"],
      exclude: ["lib/db.ts", "lib/auth.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@openup/types": path.resolve(__dirname, "../../packages/types/src/index.ts"),
      "@openup/validation": path.resolve(__dirname, "../../packages/validation/src/index.ts"),
      "@openup/domain": path.resolve(__dirname, "../../packages/domain/src/index.ts"),
      "@openup/config": path.resolve(__dirname, "../../packages/config/src/index.ts"),
      "@openup/api-client": path.resolve(__dirname, "../../packages/api-client/src/index.ts"),
      "@openup/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
    },
  },
});
