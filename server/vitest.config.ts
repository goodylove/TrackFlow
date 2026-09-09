import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      NODE_ENV: "test",
      JWT_SECRET: "isolated-test-secret-never-use-in-production",
      MONGODB_URI: "mongodb://127.0.0.1:27017/trackflow_test_unused",
      CLIENT_ORIGIN: "http://localhost:5173",
      COOKIE_SAME_SITE: "lax",
    },
    globals: true,
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/test/setup.ts"],
    testTimeout: 15000,
    hookTimeout: 60000,
    fileParallelism: false,
  },
});
