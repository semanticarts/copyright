/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { ExtensionRuleOptions, ExtensionRule, Placement } from "./types";

const defaultTopOptions: ExtensionRuleOptions = {
  forcePrefixOrSuffix: true,
  extraNewlineBetweenCopyrightAndPrefix: true,
  extraNewlineBetweenCopyrightAndContent: true,
};

const defaultBottomOptions: ExtensionRuleOptions = {
  forcePrefixOrSuffix: true,
  extraNewlineBetweenCopyrightAndContent: true,
  extraNewlineBetweenCopyrightAndSuffix: true,
  endFileWithNewlineAfterSuffix: true,
};

export interface CopyrightConfigRules {
  [x: string]: ExtensionRule;
}

export interface CopyrightConfigOptions {
  ignoreDirs: string[];
  ignoreStartsWithDot: boolean;
  whitelistDirs: string[];
}

export interface CopyrightConfig {
  rules: CopyrightConfigRules;
  options: CopyrightConfigOptions;
}

const config: CopyrightConfig = {
  rules: {
    javascript: {
      extensions: ["js", "jsx", "ts", "tsx"],
      placement: Placement.Top,
      prefix: "#!/usr/bin/env node",
      copyright:
        "/**\n" +
        ` * @copyright Copyright © 2018 - ${new Date().getFullYear()} by Semantic Arts LLC\n` +
        " * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        " */",
      options: { ...defaultTopOptions, forcePrefixOrSuffix: false },
    },

    html: {
      extensions: ["html"],
      placement: Placement.Top,
      copyright:
        "<!--\n" +
        `* @copyright Copyright © 2018 - ${new Date().getFullYear()} by Semantic Arts LLC\n` +
        "* @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        "-->",
      options: defaultTopOptions,
    },

    hashes: {
      extensions: ["trig", "nq", "ttl"],
      placement: Placement.Top,
      copyright:
        "#\n" +
        `# Copyright © 2018 - ${new Date().getFullYear()} by Semantic Arts LLC\n` +
        "# Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        "#",
      options: defaultTopOptions,
    },

    shell: {
      extensions: ["sh"],
      placement: Placement.Top,
      prefix: "#!/bin/bash -",
      copyright:
        "#\n" +
        `# Copyright © 2018 - ${new Date().getFullYear()} by Semantic Arts LLC\n` +
        "# Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        "#",
      options: defaultTopOptions,
    },

    python: {
      extensions: ["py"],
      placement: Placement.Top,
      prefix: "#!/usr/bin/env python\n# -*- coding: UTF-8 -*-",
      copyright:
        "#\n" +
        `# @copyright Copyright © 2018 - ${new Date().getFullYear()} by Semantic Arts LLC\n` +
        "# @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        "#",
      options: defaultTopOptions,
    },

    markdown: {
      extensions: ["md"],
      placement: Placement.Bottom,
      copyright:
        "## License\n" +
        "\n" +
        `- Copyright © 2018 - ${new Date().getFullYear()} by Semantic Arts LLC\n` +
        "- Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license",
      options: defaultBottomOptions,
    },
  },

  options: {
    ignoreDirs: [
      "./node_modules/**",
      "./coverage/**",
      "./dist/**",
      "./test/data/**",
      "./bin/**",
    ],
    ignoreStartsWithDot: true,
    whitelistDirs: [],
  },
};

export default config;
