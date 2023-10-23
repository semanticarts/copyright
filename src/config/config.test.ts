/**
 * @copyright Copyright © 2018 - 2023 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { ConfigValidationError } from "../errors";
import { Placement } from "../types";
import { buildConfig } from "./config";

describe("Copyright config", () => {
  const ruleKey = "some rule";

  describe("buildConfig passes correctly", () => {
    it("passes on a valid config", () => {
      const clientDefinedConfig = {
        rules: {
          [ruleKey]: {
            extensions: ["some"],
            placement: "top",
            copyright:
              "some copyright, written in current year: {{{currentYear}}}, signed {{{currentYear}}}",
          },
        },
      };

      const config = buildConfig(clientDefinedConfig);
      expect(config).toBeDefined();
      expect(config.rules).toBeDefined();
      expect(config.rules[ruleKey]).toBeDefined();
      expect(config.rules[ruleKey]?.extensions).toEqual(["some"]);
      expect(config.rules[ruleKey]?.placement).toEqual(Placement.Top);
      expect(config.rules[ruleKey]?.copyright).toEqual(
        `some copyright, written in current year: ${new Date().getFullYear()}, signed ${new Date().getFullYear()}`
      );
      expect(config.options).toBeDefined();
      expect(config.options.ignoreStartsWithDot).toBe(true);
      expect(config.options.ignoreDirs.length).toBeGreaterThan(0);
      expect(config.options.whitelistDirs.length).toBe(0);
    });
  });

  describe("buildConfig errors correctly", () => {
    describe("config structure", () => {
      it("non object config", () => {
        const config = "something else";

        try {
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("expected");
          expect(message).toContain("object");
          expect(message).toContain("received");
          expect(message).toContain("string");
        }
      });

      it("config has missing keys", () => {
        const config = {};

        try {
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("rules");
          expect(message).toContain("required");
        }
      });

      it("config has extra keys", () => {
        const config = {
          rules: {
            [ruleKey]: {
              extensions: ["js"],
              copyright: "wow!",
              placement: "top",
            },
          },
          something: "else",
        };

        try {
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("unrecognized");
          expect(message).toContain("keys");
          expect(message).toContain("something");
        }
      });
    });

    describe("rules structure", () => {
      describe("top structure", () => {
        it("config rules not an object", () => {
          const config = {
            rules: null,
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain("invalid");
            expect(message).toContain("type");
            expect(message).toContain("expected");
            expect(message).toContain("object");
          }
        });

        it("rule that isn't an object", () => {
          const config = { rules: "something that isn't an object" };
          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain("invalid");
            expect(message).toContain("type");
            expect(message).toContain("expected");
            expect(message).toContain("object");
          }
        });

        it("rule that doesn't exist", () => {
          const config = {
            rules: { [ruleKey]: null },
          };
          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("invalid");
            expect(message).toContain("type");
            expect(message).toContain("expected");
            expect(message).toContain("object");
          }
        });

        it("rule that has missing keys", () => {
          const config = {
            rules: {
              [ruleKey]: {
                copyright: "some copyright",
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("extensions");
            expect(message).toContain("placement");
            expect(message).toContain("required");
          }
        });
      });

      describe("copyright string", () => {
        it("missing copyright", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: ["ext"],
                copyright: undefined,
                placement: "top",
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("copyright");
            expect(message).toContain("required");
          }
        });

        it("empty copyright", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: ["ext"],
                copyright: "",
                placement: "top",
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("copyright");
            expect(message).toContain("empty");
          }
        });
      });

      describe("extensions", () => {
        it("missing extensions", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: null,
                copyright: "some copyright",
                placement: "top",
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("extensions");
            expect(message).toContain("invalid");
            expect(message).toContain("type");
            expect(message).toContain("expected");
            expect(message).toContain("array");
            expect(message).toContain("received");
            expect(message).toContain("null");
          }
        });

        it("empty extensions", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: [],
                copyright: "some copyright",
                placement: "top",
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("extensions");
            expect(message).toContain("array");
            expect(message).toContain("contain");
            expect(message).toContain("1");
          }
        });
      });

      describe("placement", () => {
        it("wrong placement", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: ["ext"],
                copyright: "some copyright",
                placement: "something else",
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();

            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("placement");
            expect(message).toContain("invalid");
            expect(message).toContain("union");
          }
        });
      });

      describe("options", () => {
        it("options with extra keys", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: ["ext"],
                copyright: "some copyright",
                placement: "top",
                options: "not an object",
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("options");
            expect(message).toContain("invalid");
            expect(message).toContain("type");
            expect(message).toContain("expected");
            expect(message).toContain("object");
            expect(message).toContain("received");
            expect(message).toContain("string");
          }
        });

        it("options with extra keys", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: ["ext"],
                copyright: "some copyright",
                placement: "top",
                options: {
                  extraNewlineBetweenCopyrightAndContent: true,
                  forcePrefixOrSuffix: false,
                  something: "new",
                },
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("options");
            expect(message).toContain("unrecognized");
            expect(message).toContain("keys");
            expect(message).toContain("something");
          }
        });
      });

      describe("prefix or suffix", () => {
        it("prefix exists but isn't a string", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: ["ext"],
                copyright: "some copyright",
                placement: "top",
                options: {
                  extraNewlineBetweenCopyrightAndContent: true,
                  forcePrefixOrSuffix: false,
                },
                prefix: 2,
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("prefix");
            expect(message).toContain("invalid");
            expect(message).toContain("type");
            expect(message).toContain("expected");
            expect(message).toContain("string");
            expect(message).toContain("received");
            expect(message).toContain("number");
          }
        });

        it("suffix exists but isn't a string", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: ["ext"],
                copyright: "some copyright",
                placement: "bottom",
                options: {
                  extraNewlineBetweenCopyrightAndContent: true,
                  forcePrefixOrSuffix: false,
                },
                suffix: 2,
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("suffix");
            expect(message).toContain("invalid");
            expect(message).toContain("type");
            expect(message).toContain("expected");
            expect(message).toContain("string");
            expect(message).toContain("received");
            expect(message).toContain("number");
          }
        });

        it("suffix exists but placement is top", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: ["ext"],
                copyright: "some copyright",
                placement: "top",
                options: {
                  extraNewlineBetweenCopyrightAndContent: true,
                  forcePrefixOrSuffix: false,
                },
                suffix: "some suffix",
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("suffix");
            expect(message).toContain("placement");
            expect(message).toContain("top");
          }
        });

        it("prefix exists but placement is bottom", () => {
          const config = {
            rules: {
              [ruleKey]: {
                extensions: ["ext"],
                copyright: "some copyright",
                placement: "bottom",
                options: {
                  extraNewlineBetweenCopyrightAndContent: true,
                  forcePrefixOrSuffix: false,
                },
                prefix: "some prefix",
              },
            },
          };

          try {
            buildConfig(config);
            expect(false).toBe(true);
          } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);

            const message = (
              error as ConfigValidationError
            ).message.toLowerCase();
            expect(message).toContain("config");
            expect(message).toContain("rules");
            expect(message).toContain(ruleKey);
            expect(message).toContain("prefix");
            expect(message).toContain("placement");
            expect(message).toContain("bottom");
          }
        });
      });
    });

    describe("options structure", () => {
      it("config options exists but not an object", () => {
        const config = {
          rules: {},
          options: "not an object",
        };

        try {
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("options");
          expect(message).toContain("invalid");
          expect(message).toContain("type");
          expect(message).toContain("expected");
          expect(message).toContain("object");
          expect(message).toContain("received");
          expect(message).toContain("string");
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
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("options");
          expect(message).toContain("unrecognized");
          expect(message).toContain("keys");
          expect(message).toContain("something");
        }
      });

      it("config options ignoreStartsWithDot not a boolean", () => {
        const config = {
          rules: {},
          options: {
            ignoreStartsWithDot: "not a boolean",
          },
        };

        try {
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("options");
          expect(message).toContain("ignoreStartsWithDot".toLowerCase());
          expect(message).toContain("invalid");
          expect(message).toContain("type");
          expect(message).toContain("expected");
          expect(message).toContain("boolean");
          expect(message).toContain("received");
          expect(message).toContain("string");
        }
      });

      it("config options ignoreDirs not a string array", () => {
        const config = {
          rules: {},
          options: {
            ignoreDirs: "not a string array",
          },
        };

        try {
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("options");
          expect(message).toContain("ignoreDirs".toLowerCase());
          expect(message).toContain("invalid");
          expect(message).toContain("type");
          expect(message).toContain("expected");
          expect(message).toContain("array");
          expect(message).toContain("received");
          expect(message).toContain("string");
        }
      });

      it("config options ignoreDirs is an array but not of strings", () => {
        const config = {
          rules: {},
          options: {
            ignoreDirs: [2, 3, { something: "else" }],
          },
        };

        try {
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("options");
          expect(message).toContain("ignoreDirs".toLowerCase());
          expect(message).toContain("invalid");
          expect(message).toContain("type");
          expect(message).toContain("expected");
          expect(message).toContain("string");
          expect(message).toContain("received");
          expect(message).toContain("number");
          expect(message).toContain("object");
        }
      });

      it("config options whitelistDirs not a string array", () => {
        const config = {
          rules: {},
          options: {
            whitelistDirs: "not a string array",
          },
        };

        try {
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("options");
          expect(message).toContain("whitelistDirs".toLowerCase());
          expect(message).toContain("invalid");
          expect(message).toContain("type");
          expect(message).toContain("expected");
          expect(message).toContain("array");
          expect(message).toContain("received");
          expect(message).toContain("string");
        }
      });

      it("config options whitelistDirs is an array but not of strings", () => {
        const config = {
          rules: {},
          options: {
            whitelistDirs: [2, { really: "wow" }],
          },
        };

        try {
          buildConfig(config);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();
          expect(message).toContain("config");
          expect(message).toContain("options");
          expect(message).toContain("whitelistDirs".toLowerCase());
          expect(message).toContain("invalid");
          expect(message).toContain("type");
          expect(message).toContain("expected");
          expect(message).toContain("string");
          expect(message).toContain("received");
          expect(message).toContain("number");
        }
      });
    });
  });
});
