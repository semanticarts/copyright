/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import path from "path";

import config from "../config";
import { ExtensionRule } from "../types";

/**
 * Get the supported extensions. That is, all extensions defined in extensionMap.
 *
 * @returns {string[]} The supported extensions, without the dots. E.g, ["js", "md"]
 */
const getSupportedExtensions = (): string[] => {
  const supportedExtensions = Object.values(config.rules).reduce(
    (extensions: string[], extensionRule: ExtensionRule) => [
      ...extensions,
      ...extensionRule.extensions,
    ],
    []
  );

  return supportedExtensions;
};

/**
 * Test whether or not a file should be tested. This needs to be updated for each project, separately.
 *
 * @param filepath - The filepath of the directory currently being inspected
 * @return - True if we should IGNORE the directory
 */
export const shouldIgnoreFile = (filepath: string): boolean => {
  // All of these conditions must be true for the file to be tested
  // That is, NOT ignored IFF these conditions are all true

  // Get all of the extensionRuleMap[x].extensions into a single array
  const supportedExtensions = getSupportedExtensions();
  const supportedExtensionsRegex = new RegExp(
    `\\.(${supportedExtensions.join("|")})$`
  );

  const conditions = [
    supportedExtensionsRegex.test(filepath),
    !path.dirname(filepath).includes("copyright/test/data"),
  ];
  const ignoreFile = !conditions.reduce(
    (totalBool, current) => totalBool && current,
    true
  );

  return ignoreFile;
};

/**
 * Get an extension rule (the copyright, regex, and placement) based on a files extension, like "js".
 *
 * @param extension The extension of a file, without the dot
 * @returns The extension rule for that extension
 */
export const getExtensionRuleByExtension = (
  extension: string
): ExtensionRule => {
  let foundRule: ExtensionRule | null = null;

  Object.values(config.rules).forEach((extensionRule) => {
    if (extensionRule.extensions.includes(extension)) {
      foundRule = extensionRule;
    }
  });

  if (foundRule) {
    return foundRule;
  }

  throw Error(
    `Extension ${extension} was not found to live inside of an extension rule. This should not happen!`
  );
};

/**
 * Display the filepath as relative
 *
 * @param {string} filepath
 * @param {string} root
 * @returns {string}
 */
export function displayPath(filepath: string, root: string): string {
  if (filepath.startsWith("/")) return path.relative(root, filepath);
  return filepath;
}
