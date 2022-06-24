/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { ConfigValidationError } from "../errors";
import ExtensionRuleBuilder from "./rule-builder";

describe("Copyright extension rule validation", () => {
  const builder = new ExtensionRuleBuilder("ext");

  describe("buildRule() passes correctly", () => {
    it("passes on a correct rule", () => {
      const rule = {
        extensions: ["some ext"],
        copyright: "The license is MINE",
        placement: "top",
      };

      expect(builder.buildRule(rule)).toBeDefined();
    });

    it("fills in default options", () => {
      const rule = {
        extensions: ["some ext"],
        copyright: "The license is MINE",
        placement: "top",
      };

      const extensionRule = builder.buildRule(rule);
      expect(extensionRule).toBeDefined();
      const { extraNewlineBetweenCopyrightAndContent, forcePrefixOrSuffix } =
        extensionRule.options;

      expect(extraNewlineBetweenCopyrightAndContent).toBeDefined();
      expect(forcePrefixOrSuffix).toBeDefined();
    });

    it("changes the copyright current year template", () => {
      const rule = {
        extensions: ["some ext"],
        copyright: "The license which is during {{{currentYear}}} is MINE",
        placement: "top",
      };

      const extensionRule = builder.buildRule(rule);
      expect(extensionRule).toBeDefined();
      expect(extensionRule.copyright).not.toContain("{{{currentYear}}}");
      expect(extensionRule.copyright).toContain(
        new Date().getFullYear().toString()
      );
    });
  });

  describe("buildRule() errors correctly", () => {
    it("throws a ConfigValidationError on a rule with empty extensions", () => {
      const rule = {
        extensions: [],
        copyright: "The license is MINE",
        placement: "top",
      };

      try {
        builder.buildRule(rule);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigValidationError);
        expect((error as ConfigValidationError).message).toContain("empty");
      }
    });

    it("rule that isn't an object", () => {
      const rule = "something that isn't an object";
      try {
        builder.buildRule(rule);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigValidationError);
        expect((error as ConfigValidationError).message).toContain("must");
        expect((error as ConfigValidationError).message).toContain("object");
      }
    });

    it("rule that doesn't exist", () => {
      try {
        builder.buildRule(null);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigValidationError);
        expect((error as ConfigValidationError).message).toContain("must");
        expect((error as ConfigValidationError).message).toContain("object");
      }
    });

    it("rule that has missing keys", () => {
      const rule = {
        copyright: "some copyright",
      };

      try {
        builder.buildRule(rule);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigValidationError);

        const { message } = error as ConfigValidationError;
        expect(message).toContain("missing keys");
      }
    });

    describe("bad copyright", () => {
      it("missing copyright", () => {
        const rule = {
          extensions: ["ext"],
          copyright: undefined,
          placement: "top",
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("must");
          expect(message).toContain("copyright");
          expect(message).toContain("string");
        }
      });

      it("empty copyright", () => {
        const rule = {
          extensions: ["ext"],
          copyright: "",
          placement: "top",
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("copyright");
          expect(message).toContain("empty");
        }
      });
    });

    describe("extensions", () => {
      it("missing extensions", () => {
        const rule = {
          extensions: null,
          copyright: "some copyright",
          placement: "top",
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("extensions");
          expect(message).toContain("must");
          expect(message).toContain("array");
          expect(message).toContain("strings");
        }
      });

      it("empty extensions", () => {
        const rule = {
          extensions: [],
          copyright: "some copyright",
          placement: "top",
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("extensions");
          expect(message).toContain("empty");
        }
      });
    });

    describe("placement", () => {
      it("wrong placement", () => {
        const rule = {
          extensions: ["ext"],
          copyright: "some copyright",
          placement: "something else",
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();

          expect(message).toContain("placement");
          expect(message).toContain("top");
          expect(message).toContain("bottom");
          expect(message).toContain("something else");
        }
      });
    });

    describe("options", () => {
      it("options with extra keys", () => {
        const rule = {
          extensions: ["ext"],
          copyright: "some copyright",
          placement: "top",
          options: "not an object",
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("options");
          expect(message).toContain("must");
          expect(message).toContain("object");
        }
      });

      it("options with extra keys", () => {
        const rule = {
          extensions: ["ext"],
          copyright: "some copyright",
          placement: "top",
          options: {
            extraNewlineBetweenCopyrightAndContent: true,
            forcePrefixOrSuffix: false,
            something: "new",
          },
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const { message } = error as ConfigValidationError;
          expect(message).toContain("options");
          expect(message).toContain("extraneous keys");
          expect(message).toContain("something");
        }
      });
    });

    describe("prefix or suffix", () => {
      it("prefix exists but isn't a string", () => {
        const rule = {
          extensions: ["ext"],
          copyright: "some copyright",
          placement: "top",
          options: {
            extraNewlineBetweenCopyrightAndContent: true,
            forcePrefixOrSuffix: false,
          },
          prefix: 2,
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();

          expect(message).toContain("prefix");
          expect(message).toContain("must");
          expect(message).toContain("string");
        }
      });

      it("suffix exists but isn't a string", () => {
        const rule = {
          extensions: ["ext"],
          copyright: "some copyright",
          placement: "bottom",
          options: {
            extraNewlineBetweenCopyrightAndContent: true,
            forcePrefixOrSuffix: false,
          },
          suffix: 2,
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();

          expect(message).toContain("suffix");
          expect(message).toContain("must");
          expect(message).toContain("string");
        }
      });

      it("suffix exists but placement is top", () => {
        const rule = {
          extensions: ["ext"],
          copyright: "some copyright",
          placement: "top",
          options: {
            extraNewlineBetweenCopyrightAndContent: true,
            forcePrefixOrSuffix: false,
          },
          suffix: "some suffix",
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();

          expect(message).toContain("suffix");
          expect(message).toContain("placement");
          expect(message).toContain("bottom");
        }
      });

      it("suffix exists but placement is top", () => {
        const rule = {
          extensions: ["ext"],
          copyright: "some copyright",
          placement: "bottom",
          options: {
            extraNewlineBetweenCopyrightAndContent: true,
            forcePrefixOrSuffix: false,
          },
          prefix: "some prefix",
        };

        try {
          builder.buildRule(rule);
          expect(false).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigValidationError);

          const message = (
            error as ConfigValidationError
          ).message.toLowerCase();

          expect(message).toContain("prefix");
          expect(message).toContain("placement");
          expect(message).toContain("top");
        }
      });
    });
  });
});
