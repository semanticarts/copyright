/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { ConfigValidationError } from "../errors";
import {
  Shallow,
  ExtensionRule,
  ExtensionRuleOptions,
  Placement,
} from "../types";

const defaultOptions: { [Property in Placement]: ExtensionRuleOptions } = {
  [Placement.Top]: {
    extraNewlineBetweenCopyrightAndContent: true,
    forcePrefixOrSuffix: true,
    extraNewlineBetweenCopyrightAndPrefix: true,
  },
  [Placement.Bottom]: {
    forcePrefixOrSuffix: true,
    extraNewlineBetweenCopyrightAndContent: true,
    extraNewlineBetweenCopyrightAndSuffix: true,
    endFileWithNewlineAfterSuffix: true,
  },
};

export default class ExtensionRuleValidator {
  private ruleKey: string;

  constructor(ruleKey: string) {
    this.ruleKey = ruleKey;
  }

  public validateRule(rule: unknown): ExtensionRule {
    const isCorrectlyShallow = (r: unknown): r is Shallow<ExtensionRule> => {
      return (
        r !== null &&
        typeof r === "object" &&
        "copyright" in r &&
        "extensions" in r &&
        "placement" in r
      );
    };

    const missingKeys = [];

    if (!isCorrectlyShallow(rule)) {
      if (rule === null || typeof rule !== "object") {
        throw new ConfigValidationError(
          `Rule '${this.ruleKey}' must be an object!`
        );
      }

      if (!("copyright" in rule)) {
        missingKeys.push("copyright");
      }
      if (!("extensions" in rule)) {
        missingKeys.push("extensions");
      }
      if (!("placement" in rule)) {
        missingKeys.push("placement");
      }

      throw new ConfigValidationError(
        `Rule '${this.ruleKey}' was missing keys: ${missingKeys.join(", ")}`
      );
    }

    const extensionRule: ExtensionRule = {
      copyright: this.validateCopyright(rule),
      extensions: this.validateExtensions(rule),
      placement: this.validatePlacement(rule),
      options: this.validateOptions(rule),
    };

    const { prefix, suffix } = this.validatePrefixAndSuffix(rule);
    if (prefix) extensionRule.prefix = prefix;
    if (suffix) extensionRule.suffix = suffix;

    return extensionRule;
  }

  private validatePrefixAndSuffix(rule: Shallow<ExtensionRule>): {
    prefix: ExtensionRule["prefix"];
    suffix: ExtensionRule["suffix"];
  } {
    const { prefix, suffix } = rule;

    const placement = this.validatePlacement(rule);

    if (prefix === undefined && suffix === undefined) {
      return { prefix, suffix };
    }

    if (prefix !== undefined && typeof prefix !== "string") {
      throw new ConfigValidationError("Prefix must be a string!");
    }

    if (suffix !== undefined && typeof suffix !== "string") {
      throw new ConfigValidationError("Suffix must be a string!");
    }

    if (placement === Placement.Top && suffix !== undefined) {
      throw new ConfigValidationError(
        "Suffix can only be included when 'placement' is 'bottom'!"
      );
    }

    if (placement === Placement.Bottom && prefix !== undefined) {
      throw new ConfigValidationError(
        "Prefix can only be included when 'placement' is 'top'!"
      );
    }

    return { prefix, suffix };
  }

  private validateCopyright(
    rule: Shallow<ExtensionRule>
  ): ExtensionRule["copyright"] {
    const { copyright } = rule;

    if (copyright === undefined) {
      throw new ConfigValidationError(
        `The extension rule '${this.ruleKey}' had no 'copyright' string!`
      );
    }

    if (typeof copyright !== "string") {
      throw new ConfigValidationError(
        `The extension rule '${this.ruleKey}' had a 'copyright' key that wasn't a string!`
      );
    }

    if (copyright === "") {
      throw new ConfigValidationError(
        `The extension rule '${this.ruleKey}' had an empty 'copyright' string!`
      );
    }

    // Replace the templated {{{currentYear}}} with the actual current year
    const replacedYear = copyright.replace(
      "{{{currentYear}}}",
      new Date().getFullYear().toString()
    );

    return replacedYear;
  }

  private validateExtensions(
    rule: Shallow<ExtensionRule>
  ): ExtensionRule["extensions"] {
    const { extensions } = rule;

    if (!extensions) {
      throw new ConfigValidationError(
        `The extension rule '${this.ruleKey}' had no 'extensions' array!`
      );
    }

    if (
      !Array.isArray(extensions) ||
      !extensions.every((elem) => typeof elem === "string")
    ) {
      throw new ConfigValidationError(
        `The extension rule '${this.ruleKey}' key 'extensions' needs to be an array of strings!`
      );
    }

    if (extensions.length === 0) {
      throw new ConfigValidationError(
        `The extensions array defined in rule '${this.ruleKey}' was empty!`
      );
    }

    return extensions;
  }

  private validatePlacement(
    rule: Shallow<ExtensionRule>
  ): ExtensionRule["placement"] {
    const { placement } = rule;

    if (placement === undefined) {
      throw new ConfigValidationError(
        `Placement needs to be included in rule '${this.ruleKey}'!`
      );
    }

    // Resolve placements towards the Placement enum
    switch (placement) {
      case "top" || Placement.Top:
        return Placement.Top;
      case "bottom" || Placement.Bottom:
        return Placement.Bottom;
      default:
        throw new ConfigValidationError(
          `Placement on extension rule '${this.ruleKey}' got '${placement}', not one of 'top' or 'bottom'!`
        );
    }
  }

  private validateOptions(
    rule: Shallow<ExtensionRule>
  ): ExtensionRule["options"] {
    const { options } = rule;

    // Make sure placement is validated before options
    const placement = this.validatePlacement(rule);

    if (options !== undefined && typeof options === "object") {
      return {
        ...defaultOptions[placement],
        ...options,
      };
    }

    return defaultOptions[placement];
  }
}
