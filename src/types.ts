/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

/**
 * Copyright specific types
 */

export enum Command {
  Update = "update",
  Delete = "delete",
}

export enum Mode {
  Selective = "selective",
  Recursive = "recursive",
}

export enum Placement {
  Top = "top",
  Bottom = "bottom",
}

export interface ExtensionRuleOptions {
  extraNewlineBetweenCopyrightAndContent: boolean;
  forcePrefixOrSuffix: boolean;
  extraNewlineBetweenCopyrightAndPrefix?: boolean | undefined;
  extraNewlineBetweenCopyrightAndSuffix?: boolean | undefined;
  endFileWithNewlineAfterSuffix?: boolean | undefined;
}

export interface ExtensionRule {
  extensions: string[];
  placement: Placement;
  copyright: string;
  options: ExtensionRuleOptions;
  prefix?: string | undefined;
  suffix?: string | undefined;
}

export interface CopyrightConfigRules {
  [x: string]: ExtensionRule;
}

export interface CopyrightConfigOptions {
  ignoreDirs: string[];
  ignoreStartsWithDot: boolean;
  whitelistDirs: string[];
}

export interface CopyrightConfig {
  rules: CopyrightConfigRules;
  options: CopyrightConfigOptions;
}
