import ExtensionRuleValidator from "./validate";

describe("Copyright validation", () => {
  describe("validateRule()", () => {
    it("passes on a correct rule", () => {
      const rule = {
        extensions: ["some ext"],
        copyright: "The license is MINE",
        placement: "top",
      };

      const validator = new ExtensionRuleValidator("ext");

      expect(validator.validateRule(rule)).toBeDefined();
    });

    it("fills in default options", () => {
      const rule = {
        extensions: ["some ext"],
        copyright: "The license is MINE",
        placement: "top",
      };

      const validator = new ExtensionRuleValidator("ext");

      const validatedRule = validator.validateRule(rule);
      expect(validatedRule).toBeDefined();
      const { extraNewlineBetweenCopyrightAndContent, forcePrefixOrSuffix } =
        validatedRule.options;

      expect(extraNewlineBetweenCopyrightAndContent).toBeDefined();
      expect(forcePrefixOrSuffix).toBeDefined();
    });
  });

  describe("getValidatedRule()", () => {
    it("returns back a valid rule", () => {
      const rule = {
        extensions: ["some ext"],
        copyright: "The license is MINE",
        placement: "top",
      };

      const validator = new ExtensionRuleValidator("ext");
      const validatedRule = validator.validateRule(rule);

      expect(validatedRule).toBeDefined();
      const anotherValidator = new ExtensionRuleValidator("ext");
      expect(anotherValidator.validateRule(validatedRule)).toBeDefined();
    });
  });
});
