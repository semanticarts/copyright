/**
 * @copyright Copyright © 2018 - 2026 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import-x";

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      "dist/**/*",
      "coverage/**/*",
      "bin/**/*",
      "node_modules/**/*",
      ".copyrightrc.cjs",
    ],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended,

  // Prettier plugin
  prettierPlugin,

  // Import plugin
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "always",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
      "import/no-unresolved": "off",
    },
  },

  // Custom rules for all files
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      quotes: ["error", "double"],
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": ["error"],
      "no-restricted-syntax": [
        "error",
        "ForInStatement",
        "LabeledStatement",
        "WithStatement",
      ],
      "no-continue": ["off"],
    },
  },
);
