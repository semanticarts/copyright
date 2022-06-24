/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

/**
 * General types there ought to be a library for
 */

export type Shallow<X> = {
  [x in keyof X]: unknown;
};

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
  extraNewlineBetweenCopyrightAndPrefix?: boolean;
  extraNewlineBetweenCopyrightAndSuffix?: boolean;
  endFileWithNewlineAfterSuffix?: boolean;
}

export interface ExtensionRule {
  extensions: string[];
  placement: Placement;
  copyright: string;
  options: ExtensionRuleOptions;
  prefix?: string;
  suffix?: string;
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
