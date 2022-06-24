# Usage

To use the package, either install it globally or locally with `npm`. To get started with a global installation, use the command

```
npm install -g @semantic-arts/copyright && copyright --help
```

For a local installation, use

```
npm install @semantic-arts/copyright && npx copyright --help
```

Before using any of the commands, make sure you have a valid configuration defined. The configuration needs to be either a "copyright" key on the top level of your `package.json` file, a `.copyrightrc.js`, or a `copyright.config.js` file exporting a configuration object.

That configuration object needs to have this structure:

```ts
interface Config {
  /**
   * Every key/value is called an "extension rule". They are families of
   * extensions that all carry the same copyright string.
   *
   * The rules object is empty {} by default.
   */
  rules: {
    [x: string]: {
      /**
       * A list of extensions
       *
       * NOTE: the extensions should NOT include the leading period
       * Example: ["js", "jsx", "ts", "tsx"]
       */
      extensions: string[];

      /**
       * Where the copyright gets placed in a file, either at the top or
       * the bottom. This still allows for prefixes or suffixes, like
       * shebang lines on shell scripts.
       */
      placement: "top" | "bottom";

      /**
       * The copyright that will be placed at the top of every file that
       * ends with an extension included in the extensions list.
       *
       * Note that this string is templated. Every instance of
       * "{{{currentYear}}}" in the copyright string will be replaced by
       * the actual current year, like "2022".
       *
       * Also, this copyright should not include extra newlines at the beginning
       * (for a prefix), or at the end (for spacing the copyright from
       * the content). This is handled automatically.
       */
      copyright: "This is the property of X, copyrighted {{{currentYear}}}";

      /**
       * A prefix that can come ABOVE the copyright (if placement is "top").
       * Usually because the file type requires a certain string of
       * characters at the top of a file.
       *
       * For example, shell scripts that require a #!/bin/bash shebang line
       * would define the prefix as "#!/bin/bash". Note the lack of newlines.
       *
       * Defining a prefix string when placement is "bottom" is not allowed.
       */
      prefix?: string;

      /**
       * A suffix that can come BELOW the copyright (if placement is "bottom").
       * Unlike the shebang, which is common, this option is slightly uncommon.
       *
       * Defining a prefix string when placement is "top" is not allowed.
       */
      suffix?: string; // Only define a suffix when placement is "bottom",

      /**
       * Some options to define the behavior of the copyright. See the
       * examples section for behavior
       */
      options?: {
        /**
         * Whether to include an extra newline between the copyright
         * string and content string. This option is defined for
         * placement being "top" OR "bottom".
         *
         * This is `true` by default.
         */
        extraNewlineBetweenCopyrightAndContent?: boolean;

        /**
         * If this option is `true` and a prefix/suffix is defined for an
         * extension rule, but the file being tested does NOT have
         * a prefix/suffix, then the prefix/suffix will get ADDED
         *
         * This is set to `true` by default.
         */
        forcePrefixOrSuffix?: boolean;

        /**
         * Whether to include an extra newline between the copyright
         * string and the prefix.
         *
         * This option has no effect if there is no prefix defined.
         *
         * This is `true` by default
         */
        extraNewlineBetweenCopyrightAndPrefix?: boolean;

        /**
         * Whether to include an extra newline between the copyright
         * string and the suffix.
         *
         * This option has no effect if there is no suffix defined.
         *
         * This is `true` by default
         */
        extraNewlineBetweenCopyrightAndSuffix?: boolean;

        /**
         * Whether to include an extra newline between the suffix
         * and the EOF. This just makes sure the last character
         * of the file is a newline character.
         */
        endFileWithNewlineAfterSuffix?: boolean;
      };
    };
  };

  /**
   * General options for how the script should behave. Deals with the question
   * of which files to test and change the copyright of
   */
  options?: {
    /**
     * A list of glob patterns for directories to ignore. Superceded
     * by the whitelistDirs option.
     *
     * This is ["./node_modules/**", "./coverage/**", "./dist/**"] by default
     */
    ignoreDirs?: string[] = ["./node_modules/**", "./coverage/**", "./dist/**"];

    /**
     * A boolean to describe whether to ignore files that begin
     * with period `.`
     *
     * This is true by default
     */
    ignoreStartsWithDot?: boolean = true;

    /**
     * A list of glob patterns for directories to whitelist, after
     * the ignoreDirs may have potentially ignored them.
     *
     * This is empty by default
     */
    whitelistDirs?: string[] = [];
  };
}
```

Here is the contents of the `.copyrightrc.js` configuration file that Semantic Arts uses for its files (as you can see at the bottom of this `md` document, also):

```js
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
  },
};
```

- The copyright string is templated for the current year. Any instance of `{{{currentYear}}}` in the string is replaced with the current year, such as `2022`.
-

## License

- Copyright © 2018 - 2022 by Semantic Arts LLC
- Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
