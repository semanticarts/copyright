/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { ConfigValidationError } from "../errors";
import { Placement } from "../types";
import ConfigBuilder from "./config-builder";

describe("Copyright config", () => {
  describe("ConfigBuilder.buildRule() passes correctly", () => {
    it("passes on a valid config", () => {
      const ruleKey = "some rule";

      const clientDefinedConfig = {
        rules: {
          [ruleKey]: {
            extensions: ["some"],
            placement: "top",
            copyright:
              "some copyright, written in current year: {{{currentYear}}}",
          },
        },
      };

      const config = ConfigBuilder.buildConfig(clientDefinedConfig);
      expect(config).toBeDefined();
      expect(config.rules).toBeDefined();
      expect(config.rules[ruleKey]).toBeDefined();
      expect(config.rules[ruleKey]?.extensions).toEqual(["some"]);
      expect(config.rules[ruleKey]?.placement).toEqual(Placement.Top);
      expect(config.rules[ruleKey]?.copyright).toEqual(
        `some copyright, written in current year: ${new Date().getFullYear()}`
      );
      expect(config.options).toBeDefined();
      expect(config.options.ignoreStartsWithDot).toBe(true);
      expect(config.options.ignoreDirs.length).toBeGreaterThan(0);
      expect(config.options.whitelistDirs.length).toBe(0);
    });
  });

  describe("ConfigBuilder.buildRule() errors correctly", () => {
    describe("config structure", () => {
      it("non object config", () => {
        const config = "something else";

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("config");
          expect(message).toContain("must");
          expect(message).toContain("object");
        }
      });

      it("config has missing keys", () => {
        const config = {};

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("Config");
          expect(message).toContain("missing keys");
          expect(message).toContain("rules");
        }
      });

      it("config has extra keys", () => {
        const config = {
          rules: {},
          something: "else",
        };

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("Config");
          expect(message).toContain("extra keys");
          expect(message).toContain("something");
        }
      });
    });

    describe("rules structure", () => {
      it("config rules not an object", () => {
        const config = {
          rules: null,
        };

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("rules");
          expect(message).toContain("must");
          expect(message).toContain("object");
        }
      });
    });

    describe("options structure", () => {
      it("config options exists but not an object", () => {
        const config = {
          rules: {},
          options: "not an object",
        };

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("options");
          expect(message).toContain("must");
          expect(message).toContain("object");
        }
      });

      it("config options extra keys", () => {
        const config = {
          rules: {},
          options: {
            something: "else",
          },
        };

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("options");
          expect(message).toContain("extra keys");
          expect(message).toContain("something");
        }
      });

      it("config options starts with dot not a boolean", () => {
        const config = {
          rules: {},
          options: {
            ignoreStartsWithDot: "not a boolean",
          },
        };

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("options");
          expect(message).toContain("ignoreStartsWithDot");
          expect(message).toContain("boolean");
        }
      });

      it("config options ignore dirs not a string array", () => {
        const config = {
          rules: {},
          options: {
            ignoreDirs: "not a string array",
          },
        };

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("options");
          expect(message).toContain("ignoreDirs");
          expect(message).toContain("string array");
        }
      });

      it("config options ignore dirs is an array but not of strings", () => {
        const config = {
          rules: {},
          options: {
            ignoreDirs: [2, 3, { something: "else" }],
          },
        };

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("options");
          expect(message).toContain("ignoreDirs");
          expect(message).toContain("string array");
        }
      });

      it("config options whitelist dirs not a string array", () => {
        const config = {
          rules: {},
          options: {
            whitelistDirs: "not a string array",
          },
        };

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("options");
          expect(message).toContain("whitelistDirs");
          expect(message).toContain("string array");
        }
      });

      it("config options whitelist dirs is an array but not of strings", () => {
        const config = {
          rules: {},
          options: {
            whitelistDirs: [2, "wow"],
          },
        };

        try {
          ConfigBuilder.buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("options");
          expect(message).toContain("whitelistDirs");
          expect(message).toContain("string array");
        }
      });
    });
  });
});
