/**
 * @copyright Copyright © 2018 - 2026 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/?(*.)+(spec|test).ts?(x)"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    coverage: {
      enabled: true,
      provider: "v8",
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      reporter: ["html", "text"],
      reportsDirectory: "coverage",
    },
    clearMocks: true,
  },
});
