/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { ConfigValidationError } from "../errors";
import {
  Shallow,
  isShallow,
  getMissingKeys,
  getExtraneousKeys,
} from "../lib/types";
import {
  CopyrightConfig,
  CopyrightConfigOptions,
  CopyrightConfigRules,
} from "../types";
import ExtensionRuleBuilder from "./rule-builder";

const defaultOptions: CopyrightConfigOptions = {
  ignoreDirs: ["./node_modules/**", "./coverage/**", "./dist/**"],
  ignoreStartsWithDot: true,
  whitelistDirs: [],
};

export default class ConfigBuilder {
  public static buildConfig(config: unknown): CopyrightConfig {
    // See the definition of Shallow. I wish this duplication wasn't necessary.
    const requiredKeys = ["rules"];
    const validKeys = ["rules", "options"];

    if (!isShallow<CopyrightConfig>(config, requiredKeys)) {
      if (config === null || typeof config !== "object") {
        throw new ConfigValidationError("The config must be an object!");
      }

      const missingKeys = getMissingKeys(config, requiredKeys);
      throw new ConfigValidationError(
        `Config was missing keys: ${missingKeys.join(", ")}`
      );
    }

    const extraKeys = getExtraneousKeys(config, validKeys);
    if (extraKeys.length > 0) {
      throw new ConfigValidationError(
        `Config had extra keys: ${extraKeys.join(", ")}`
      );
    }

    const options = this.validateOptions(config);
    const rules = this.validateRules(config);
    return { options, rules };
  }

  private static validateRules(
    config: Shallow<CopyrightConfig>
  ): CopyrightConfig["rules"] {
    const { rules } = config;

    if (!rules || typeof rules !== "object") {
      throw new ConfigValidationError("Config 'rules' must be an object!");
    }

    const configRules: CopyrightConfigRules = {};

    for (const [key, rule] of Object.entries(rules)) {
      const ruleBuilder = new ExtensionRuleBuilder(key);
      const extensionRule = ruleBuilder.buildRule(rule);
      configRules[key] = extensionRule;
    }

    return configRules;
  }

  private static validateOptions(
    config: Shallow<CopyrightConfig>
  ): CopyrightConfigOptions {
    const { options } = config;

    const configOptions: CopyrightConfigOptions = { ...defaultOptions };

    if (options === null || options === undefined) {
      return configOptions;
    }

    if (typeof options !== "object") {
      throw new ConfigValidationError(
        "The config 'options' must be an object!"
      );
    }

    // See the definition of the Shallow type, I wish this wasn't duplicated
    const validKeys = ["ignoreDirs", "whitelistDirs", "ignoreStartsWithDot"];

    // Check for unknown keys
    const extraKeys = getExtraneousKeys(options, validKeys);
    if (extraKeys.length > 0) {
      throw new ConfigValidationError(
        `Found extra keys in config 'options': ${extraKeys.join(", ")}`
      );
    }

    if (!this.hasCorrectIgnoreDirs(options)) {
      throw new ConfigValidationError(
        "The 'options.ignoreDirs' needs to be a string array!"
      );
    }

    if (!this.hasCorrectIgnoreStartsWithDot(options)) {
      throw new ConfigValidationError(
        "The 'options.ignoreStartsWithDot' needs to be a boolean!"
      );
    }

    if (!this.hasCorrectWhitelistDirs(options)) {
      throw new ConfigValidationError(
        "The 'options.whitelistDirs' needs to be a string array!"
      );
    }

    return { ...defaultOptions, ...options };
  }

  /**
   * These three methods are largely the same. I wish there were some
   * way to easily validate these optional properties.
   *
   * Each methods checks if the optional property is in the object,
   * and if it isn't, it returns true (since that's valid).
   *
   * If the optional type IS there, it does some additional checking
   * to transform it from unknown to its intended type.
   */

  private static hasCorrectIgnoreStartsWithDot(
    options: object
  ): options is object & { ignoreStartsWithDot: boolean } {
    const hasIgnoreStartsWithDot = (
      obj: object
    ): obj is object & { ignoreStartsWithDot?: unknown } => {
      return "ignoreStartsWithDot" in obj;
    };

    if (!hasIgnoreStartsWithDot(options)) return true;

    return typeof options.ignoreStartsWithDot === "boolean";
  }

  private static hasCorrectWhitelistDirs(
    options: object
  ): options is object & { whitelistDirs?: string[] } {
    const hasWhitelistDirs = (
      obj: object
    ): obj is object & { whitelistDirs?: unknown } => {
      return "whitelistDirs" in obj;
    };

    // If the option is not included, it is correct, since
    // whitelistDirs is optional anyway
    if (!hasWhitelistDirs(options)) return true;

    // If it IS included, then validate the type
    return (
      Array.isArray(options.whitelistDirs) &&
      options.whitelistDirs.every((elem) => typeof elem === "string")
    );
  }

  private static hasCorrectIgnoreDirs(
    options: object
  ): options is object & { ignoreDirs?: string[] } {
    const hasIgnoreDirs = (
      obj: object
    ): obj is object & { ignoreDirs?: unknown } => {
      return "ignoreDirs" in obj;
    };

    // If the option is not included, it is correct, since
    // ignoreDirs is optional anyway
    if (!hasIgnoreDirs(options)) return true;

    // If it IS included, then validate the type
    return (
      Array.isArray(options.ignoreDirs) &&
      options.ignoreDirs.every((elem) => typeof elem === "string")
    );
  }
}
