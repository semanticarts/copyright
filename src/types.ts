/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
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
  Top,
  Bottom,
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
