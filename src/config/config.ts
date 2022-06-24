/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { cosmiconfigSync } from "cosmiconfig";

import { CopyrightConfig, ExtensionRule } from "../types";
import { ConfigValidationError } from "../errors";
import ConfigBuilder from "./config-builder";
import ExtensionRuleValidator from "./validate";

interface CopyrightConfigShallow {
  rules: {
    [x: string]: unknown;
  };
  options?: unknown;
}

function validateCopyrightConfigShallow(
  uncleanConfig: unknown
): CopyrightConfigShallow {
  const config = uncleanConfig;

  if (!config) {
    throw new ConfigValidationError("The config does not exist!");
  }

  if (typeof config !== "object") {
    throw new ConfigValidationError("The config must be an object!");
  }

  const hasRules = (c: unknown): c is { rules: unknown } => {
    return typeof c === "object" && c !== null && "rules" in c;
  };

  if (!hasRules(config)) {
    throw new ConfigValidationError("The 'rules' object is missing!");
  }

  // This is the only way I've found I can "narrow" the type down

  if (!config.rules) {
    throw new ConfigValidationError("The 'rules' object is missing!");
  }

  const rulesIsObject = (c: {
    rules: unknown;
  }): c is { rules: { [x: string]: unknown } } => {
    return c.rules !== null && typeof c.rules === "object";
  };

  if (!rulesIsObject(config)) {
    throw new ConfigValidationError(
      "The 'rules' key must have a value that's an object!"
    );
  }

  if (Object.keys(config.rules).length === 0) {
    throw new ConfigValidationError(
      "The 'rules' object is empty! Add at least one rule!"
    );
  }

  return config;
}

function validateConfig(uncleanConfig: unknown): CopyrightConfig {
  const configBuilder = new ConfigBuilder();

  let configShallow: CopyrightConfigShallow;
  try {
    configShallow = validateCopyrightConfigShallow(uncleanConfig);
  } catch (error) {
    throw new ConfigValidationError(
      `The config object has the wrong structure: ${(error as Error).message}`
    );
  }

  for (const [ruleKey, uncleanExtensionRule] of Object.entries(
    configShallow.rules
  )) {
    let extensionRule = uncleanExtensionRule;

    try {
      const validator = new ExtensionRuleValidator(ruleKey);
      extensionRule = validator.validateRule(extensionRule);
    } catch (error) {
      throw new ConfigValidationError(
        `Extension rule '${ruleKey}' has the wrong structure! ${
          (error as Error).message
        }`
      );
    }

    // We went through the validator, so we know extensionRule is type ExtensionRule
    configBuilder.addExtensionRule(ruleKey, extensionRule as ExtensionRule);
  }

  const config = configBuilder.build();

  return config;
}

export function resolveConfig(): CopyrightConfig {
  const explorer = cosmiconfigSync("copyright", {
    searchPlaces: ["package.json", ".copyrightrc.js", "copyright.config.js"],
  });

  const result = explorer.search();

  if (!result) {
    throw Error(
      "Config was not found! Either include a '.copyrightrc.js' or 'copyright.config.js' file, or a \"copyright\" key in your package.json"
    );
  }

  const config = validateConfig(result.config);
  return config;
}

export default resolveConfig();
