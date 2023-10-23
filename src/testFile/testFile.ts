/**
 * @copyright Copyright © 2018 - 2023 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import fs from "fs";
import { escapeRegExp } from "lodash";
import path from "path";

import {
  shouldIgnoreFile,
  displayPath,
  getExtensionRuleByExtension,
} from "./util";

import { CopyrightConfig, ExtensionRule, Placement, Command } from "../types";

/**
 * Replace the content of a file with new content.
 *
 * @param filepath - Which file we are editing.
 * @param newFile - The contents of the file after editing. What we want the file to be.
 */
const editFile = (filepath: string, newFile: string): void => {
  try {
    fs.writeFileSync(filepath, newFile, "utf8");
  } catch (error) {
    console.error(`editFile() error: ${(error as Error).message}`);
  }
};

/**
 * Replaces the current year in any string with [0-9]{4}.
 *
 * @param {string} string The string to replace
 * @returns {string} The replaced string
 */
function replaceYearWithRegex(string: string): string {
  return string.replace(new Date().getFullYear().toString(), "[0-9]{4}");
}

/**
 * If the isCopyrightBlock boolean is truthy, then that regex (piece of
 * the structure of the file) belongs to the copyright
 */
type RegexCallback = (block?: string) => string;

/**
 *
 * @param name
 * @param string - The regex to put in, e.g. "[\\s, \\S]" or "\\n"
 * @param random - Whether the named capture group needs to have a salt added.
 *    Currently in use only for the newlines, since we cannot have multiple capture
 *    groups called "newline", so they get called "newline98542" or something.
 *    Defaults to false
 */
const makeRequiredRegex =
  (name: string, string: string, random = false): RegexCallback =>
  (block?: string) => {
    const salt = Math.floor(Math.random() * 99999);
    let newName = name;
    newName += random ? salt : "";
    newName += block ? `_${block}` : "";

    return `(?<${newName}>${string})`;
  };

/**
 * See makeRequiredRegex. This appends a "?" to the end.
 *
 * @param name
 * @param string - The regex to put in, e.g. "[\\s, \\S]" or "\\n"
 * @param random - Whether the named capture group needs to have a salt added.
 *    Currently in use only for the newlines, since we cannot have multiple capture
 *    groups called "newline", so they get called "newline98542" or something.
 *    Defaults to false
 */
const makeOptionalRegex =
  (name: string, string: string, random = false): RegexCallback =>
  (block?: string) =>
    `${makeRequiredRegex(name, string, random)(block)}?`;

/**
 * When there is a suffix, we need to put the suffix and its newlines into a
 *  positive lookahead, since the content regex is [\s\S]* and will match EVERYTHING.
 *  This creates the beginning of that positive lookahead. See makeLookaheadEnd for
 *  creating the end.
 * @param regex - The regex that is in the lookahead. Usually the content
 *  regex of [\s|S]*
 * @returns The start string of a lookahead.
 */
const makeLookaheadStart = (regex: string): string => {
  return `${regex}(?=(?:`;
};

/**
 * See the makeLookaheadStart function
 *
 * @returns The end string
 */
const makeLookaheadEnd = (): string => "))";

/**
 * There are 4 regex's that need to be worried about. Top placement, bottom placement, and for each of those categories, whether the person wants to surround their copyright.
 * For example, shell and python files have a requires prefix, but anything can be following that, whereas javascript files don't.
 *
 * The general structure of a file is:
 *    prefix      (if prefix)
 *    newline     (if prefix)
 *    newline     (if prefix)
 *    copyright   (if top)
 *    newline     (if top)
 *    newline     (if top)
 *    content
 *    copyright   (if bottom)
 *    newline     (if bottom)
 *    newline     (if suffix)
 *    suffix      (if suffix)
 *    newline     (if suffix)
 *
 * The regexStructure generates the appropriate structure for this generic file structure
 * Then, the regexStructure gets converted into regex and returned.
 *
 * Also note that the functions like copyright and newline take the `placement` as an
 * argument. This is to solve the problem of "how do I tell which capturing groups" belong
 * to the copyright, and which do not. They need to be separate capturing groups to solve
 * newline issues, but they also need to know that they belong to the copyright block, such
 * that if we want to DELETE the copyright, we can choose NOT to add those capturing groups
 * back in.
 *
 * The way this is currently solved is by naming a capturing group, and then appending either
 * either _copyright or nothing. If _copyright is at the end of a capturing group name,
 * that capturing group belongs to the copyright block.
 *
 * @param {ExtensionRule} extensionRule
 * @returns {RegExp}
 */
const generateRegex = (extensionRule: ExtensionRule): RegExp => {
  const {
    placement,
    prefix: unsafePrefix,
    suffix: unsafeSuffix,
    copyright: unsafeCopyright,
  } = extensionRule;

  // The copyright string with [0-9]{4} instead of current year
  const copyrightRegexString = replaceYearWithRegex(
    escapeRegExp(unsafeCopyright)
  );

  const prefix = makeOptionalRegex("prefix", escapeRegExp(unsafePrefix));
  const suffix = makeOptionalRegex("suffix", escapeRegExp(unsafeSuffix));
  const copyright = makeOptionalRegex("copyright", `${copyrightRegexString}`);
  const newline = makeOptionalRegex("newline", "\n", true);
  const newlineRequired = makeRequiredRegex("newline", "\n", true);
  const content = () => "(?<content>[\\s\\S]*?)"; // Special because of the lookahead

  const regexStructureNested: (string | string[] | undefined)[] = [
    "^",
    unsafePrefix
      ? [prefix("prefix"), newline("prefix"), newline("prefix")]
      : undefined,
    placement === Placement.Top
      ? [copyright("copyright"), newline("copyright"), newline("copyright")]
      : undefined,
    placement === Placement.Top ? content() : undefined,
    placement === Placement.Bottom
      ? [makeLookaheadStart(content()), newlineRequired()]
      : undefined,
    placement === Placement.Bottom
      ? [newline("copyright"), copyright("copyright"), newline("copyright")]
      : undefined,
    unsafeSuffix
      ? [newline("suffix"), suffix("suffix"), newline("suffix")]
      : undefined,
    "$",
    placement === Placement.Bottom ? makeLookaheadEnd() : undefined,
  ];

  const regexStructure: string[] = regexStructureNested.reduce(
    (total: string[], stringOrArray: string | string[] | undefined) => {
      if (Array.isArray(stringOrArray)) total.push(...stringOrArray);
      else if (typeof stringOrArray === "string") total.push(stringOrArray);
      return total;
    },
    []
  );

  const totalRegex = new RegExp(regexStructure.join(""));
  return totalRegex;
};

interface StructureDefaults {
  [x: string]: string | undefined;
  prefix: string | undefined;
  suffix: string | undefined;
  copyright: string;
  newline: string;
}

/**
 * Going through the matches, reconstruct the file as it is meant to be, copyright included.
 *
 * @param extensionRule The extension rule. Provides the prefix/suffix and copyright
 * @param matchGroups The groups that returned from the regex. Each key is a named
 *    group in the regex. The value is undefined if the group was unmatched, and the value
 *    of the group if it was matched.
 * @param command Whether or not to be deleting copyrights or not. False
 *    by default. TODO: implement this for delete
 * @returns
 */
function reconstructFileFromStructure(
  extensionRule: ExtensionRule,
  matchGroups: { [x: string]: string },
  command: Command
) {
  const { prefix, suffix, copyright } = extensionRule;
  const defaults: StructureDefaults = {
    prefix,
    suffix,
    copyright,
    newline: "\n",
  };

  let totalString = "";
  for (const unsafeGroupName of Object.keys(matchGroups)) {
    const [groupName, block] = unsafeGroupName.split("_");
    if (!groupName) {
      throw Error("This should never happen! Group name is undefined!");
    }

    // Relies on the XXX_bottom or XXX_top named capturing group scheme
    const matchGroup = matchGroups[unsafeGroupName];

    if (command === Command.Delete && block === "copyright") {
      // If the regex group has a name like XXX_copyright,
      // depending on the placement, then those capturing groups
      // belong to the copyright. If we are meant to delete the copyright,
      // DO NOT add the capturing groups to the resulting file.
      continue;
    } else if (block === "prefix" || block === "suffix") {
      // If we are NOT enforcing the presence of the prefix or the suffix,
      // if we get to a regex capture group that belongs to the prefix or
      // suffix block, AND, it is missing in the file, we just ignore that.
      // That is, add it only if it already existed...
      if (extensionRule.options.forcePrefixOrSuffix) {
        totalString += groupName.includes("newline")
          ? defaults.newline
          : defaults[block];
      } else if (matchGroup) {
        totalString += matchGroup;
      }
    } else if (groupName === "copyright") {
      // If the copyright is there or isn't, add the default
      // which is the copyright string
      totalString += defaults.copyright;
    } else if (groupName.includes("newline")) {
      // If the newline is there or isn't, add it
      // Has to account for different capturing group naming
      // e.g. newline1, newline2, ...
      totalString += defaults.newline;
    } else if (matchGroup) {
      // If something was there, add it
      // e.g. present prefixes, suffixes, content, etc.
      totalString += matchGroup;
    } else if (groupName in defaults) {
      // If something was NOT there but is present in the regex, add the default of it
      // If even defaults doesn't have it, e.g. "content", then add nothing
      totalString += defaults[groupName];
    }
  }

  return totalString;
}

interface FileTestResult {
  fileModern: boolean;
  error?: Error;
}

/**
 * Test a file for it being modern or not.
 *
 * @param filepath The path to the file
 * @param root The root path
 * @param command The copyright command
 */
export default function testFile(
  filepath: string,
  root: string,
  command: Command,
  config: CopyrightConfig
): FileTestResult {
  try {
    if (shouldIgnoreFile(filepath)) {
      console.info(`Ignoring file: ${displayPath(filepath, root)}`);
      // Returning true doesn't affect the status of the rest of the directory
      // Since we are '&&' them together
      return { fileModern: true };
    }

    console.info(`Testing file: ${displayPath(filepath, root)}`);

    // Get the rule for the extension
    const extension = path.extname(filepath).slice(1); // Remove the '.'
    const extensionRule = getExtensionRuleByExtension(extension, config.rules);

    // Get the fileData from the file
    const fileData = fs.readFileSync(filepath, { encoding: "utf8" }) as string;

    const regex = generateRegex(extensionRule);
    const regexResults = regex.exec(fileData);

    if (!regexResults) {
      throw Error("Regex couldn't parse file!");
    }

    const reconstructedFileData = reconstructFileFromStructure(
      extensionRule,
      regexResults.groups as {
        [key: string]: string; // Cast because I know the regex has named groups
      },
      command
    );

    // Replace the contents of the file with the reconstructed contents
    editFile(filepath, reconstructedFileData);

    // If the data changed, it was not up-to-date
    return { fileModern: fileData === reconstructedFileData };
  } catch (error) {
    return { fileModern: false, error: error as Error };
  }
}
