module.exports = {
  rules: {
    javascript: {
      extensions: ["js", "jsx", "ts", "tsx"],
      placement: "top",
      prefix: "#!/usr/bin/env node",
      copyright:
        "/**\n" +
        ` * @copyright Copyright © 2018 - {{{currentYear}}} by Semantic Arts LLC\n` +
        " * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        " */",
      options: { forcePrefixOrSuffix: false },
    },

    html: {
      extensions: ["html"],
      placement: "top",
      copyright:
        "<!--\n" +
        `* @copyright Copyright © 2018 - {{{currentYear}}} by Semantic Arts LLC\n` +
        "* @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        "-->",
    },

    hashes: {
      extensions: ["trig", "nq", "ttl", "rq"],
      placement: "top",
      copyright:
        "#\n" +
        `# Copyright © 2018 - {{{currentYear}}} by Semantic Arts LLC\n` +
        "# Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        "#",
    },

    shell: {
      extensions: ["sh"],
      placement: "top",
      prefix: "#!/bin/bash -",
      copyright:
        "#\n" +
        `# Copyright © 2018 - {{{currentYear}}} by Semantic Arts LLC\n` +
        "# Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        "#",
    },

    python: {
      extensions: ["py"],
      placement: "top",
      prefix: "#!/usr/bin/env python\n# -*- coding: UTF-8 -*-",
      copyright:
        "#\n" +
        `# @copyright Copyright © 2018 - {{{currentYear}}} by Semantic Arts LLC\n` +
        "# @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license\n" +
        "#",
    },

    markdown: {
      extensions: ["md"],
      placement: "bottom",
      copyright:
        "## License\n" +
        "\n" +
        `- Copyright © 2018 - {{{currentYear}}} by Semantic Arts LLC\n` +
        "- Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license",
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
