import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Same "@/…" imports as tsconfig paths, so tests can load app modules.
const root = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  resolve: { alias: [{ find: /^@\//, replacement: root }] },
  test: { environment: "node", include: ["lib/**/*.test.ts", "app/**/*.test.ts", "scripts/**/*.test.mjs"] },
});
