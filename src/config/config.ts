/**
 * @copyright Copyright © 2018 - 2023 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { cosmiconfigSync } from "cosmiconfig";
import { ZodError, ZodIssue } from "zod";
import { ConfigValidationError } from "../errors";

import { CopyrightConfig } from "../types";
import { clientDefinedCopyrightConfigSchema } from "./client-types";

/**
 * Format a ZodError into a human readable message.
 *
 * @param error The error from the zod validation
 * @returns Some human readable string
 */
function formatError(error: ZodError) {
  function formatIssue(issue: ZodIssue): string {
    const friendlyPath = ["config", issue.path].join(".");

    return `Issue: ${issue.code}\n  -> Message: ${issue.message}\n  -> Object path: ${friendlyPath}\n`;
  }

  const messageString =
    error.issues.length === 1
      ? "Found an error"
      : `Found ${error.issues.length} errors`;

  return `${messageString}: \n${error.issues.map(formatIssue).join("\n")}`;
}

/**
 * The resolveConfig function just FINDS the config. The buildConfig
 * actually does the validation
 *
 * @param config
 * @returns The final config object. This is only returned if the passed config is valid.
 * @throws {ConfigValidationError|Error}
 *    - Config validation error happens when the config is wrong.
 *    - Error happens when the programming is wrong.
 */
export function buildConfig(config: unknown): CopyrightConfig {
  try {
    return clientDefinedCopyrightConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ConfigValidationError(formatError(error));
    }

    throw Error(`Something unexpected went wrong! Error: ${error}`);
  }
}

/**
 * Find one of the copyright config files and build/validate it
 *
 * @returns The fully built copyright configuration object.
 */
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

  const config = buildConfig(result.config);
  return config;
}

export default resolveConfig();
