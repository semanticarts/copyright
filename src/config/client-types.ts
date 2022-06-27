/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { z } from "zod";
import {
  Placement,
  ExtensionRuleOptions,
  CopyrightConfigOptions,
} from "../types";

/**
 * This conforms loosely to the CopyrightConfig type.
 *
 * This type is what the user inputs. It gets converted by validation into
 * a CopyrightConfig type.
 */
export interface ClientDefinedCopyrightConfig {
  rules: {
    [x: string]: {
      extensions: string[];
      placement: "top" | "bottom";
      copyright: string;
      prefix?: string;
      suffix?: string;
      options?: {
        extraNewlineBetweenCopyrightAndContent?: boolean;
        forcePrefixOrSuffix?: boolean;
        extraNewlineBetweenCopyrightAndPrefix?: boolean;
        extraNewlineBetweenCopyrightAndSuffix?: boolean;
        endFileWithNewlineAfterSuffix?: boolean;
      };
    };
  };
  options?: {
    ignoreDirs?: string[];
    ignoreStartsWithDot?: boolean;
    whitelistDirs?: string[];
  };
}

const defaultConfigOptions: CopyrightConfigOptions = {
  ignoreDirs: ["./node_modules/**", "./coverage/**", "./dist/**"],
  ignoreStartsWithDot: true,
  whitelistDirs: [],
};

const defaultRuleOptions: { [Property in Placement]: ExtensionRuleOptions } = {
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

/**
 * All schemas were generated by the ts-to-zod package, based on the zod validation package.
 *
 * This schema is edited to conform the ClientDefinedCopyrightConfig
 * into the CopyrightConfig type.
 *
 * See ClientDefinedCopyrightConfig type for the source of truth.
 */

export const clientDefinedExtensionRuleSchema = z
  .object({
    extensions: z.array(z.string()).nonempty(),
    placement: z
      .union([z.literal("top"), z.literal("bottom")])
      .transform((placement) => {
        switch (placement) {
          case "top":
            return Placement.Top;
          case "bottom":
            return Placement.Bottom;
          default:
            // No need for default case because it will fail before then
            // This will never happen but makes eslint happy
            return Placement.Top;
        }
      }),
    copyright: z
      .string()
      .refine((s: string) => s.length > 0, "Copyright string can't be empty!")
      .transform((s: string) =>
        s.replace(
          /\{\{\{currentYear\}\}\}/g,
          new Date().getFullYear().toString()
        )
      ),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
    options: z
      .object({
        extraNewlineBetweenCopyrightAndContent: z.boolean().optional(),
        forcePrefixOrSuffix: z.boolean().optional(),
        extraNewlineBetweenCopyrightAndPrefix: z.boolean().optional(),
        extraNewlineBetweenCopyrightAndSuffix: z.boolean().optional(),
        endFileWithNewlineAfterSuffix: z.boolean().optional(),
      })
      .strict()
      .optional()
      .transform((opts) => ({
        // These two keys are AFTER, since they coerce take undefined and force it to be default of true
        ...opts,
        forcePrefixOrSuffix: opts?.forcePrefixOrSuffix ?? true,
        extraNewlineBetweenCopyrightAndContent:
          opts?.extraNewlineBetweenCopyrightAndContent ?? true,
      })),
  })
  .strict()
  // Transform the options here, since this is the nearest
  // parent between placement and options,
  // and the options is dependent on placement
  .transform((data) => ({
    ...data,
    options: { ...defaultRuleOptions[data.placement], ...data.options },
  }))
  .refine(
    (data) => !(data.placement === Placement.Bottom && data.prefix),
    "A 'prefix' string can only be defined if 'placement' is 'top'!. Got 'placement' of 'bottom'"
  )
  .refine(
    (data) => !(data.placement === Placement.Top && data.suffix),
    "A 'suffix' string can only be defined if 'placement' is 'bottom'. Got 'placement' of 'top'!"
  );

export const clientDefinedCopyrightConfigSchema = z
  .object({
    rules: z
      .record(clientDefinedExtensionRuleSchema)
      .refine(
        (data) => Object.keys(data).length > 0,
        "Config must include at least one extension rule in the 'rules' object!"
      ),
    options: z
      .object({
        ignoreDirs: z.array(z.string()),
        ignoreStartsWithDot: z.boolean(),
        whitelistDirs: z.array(z.string()),
      })
      .strict()
      .optional()
      .default(defaultConfigOptions)
      .transform((opts) => ({ ...defaultConfigOptions, ...opts })),
  })
  .strict();