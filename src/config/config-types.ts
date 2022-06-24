/**
 * These are the types that the USER will define, and what is optional or not
 *
 * They will eventually be built out into types like ExtensionRule, CopyrightConfig, etc.
 */

export interface ClientDefinedExtensionRuleOptions {
  extraNewlineBetweenCopyrightAndContent?: boolean;
  forcePrefixOrSuffix?: boolean;
  extraNewlineBetweenCopyrightAndPrefix?: boolean;
  extraNewlineBetweenCopyrightAndSuffix?: boolean;
  endFileWithNewlineAfterSuffix?: boolean;
}

export interface ClientDefinedExtensionRule {
  extensions?: string[];
  copyright?: string;
  placement?: string;
  options?: ClientDefinedExtensionRuleOptions;
  prefix?: string;
  suffix?: string;
}

export interface ClientDefinedConfigOptions {
  ignoreDirs?: string[];
  ignoreStartsWithDot?: boolean;
  whitelistDirs?: string[];
}

export interface ClientDefinedConfig {
  rules: {
    [x: string]: ClientDefinedExtensionRule;
  };
  options?: ClientDefinedConfigOptions;
}
