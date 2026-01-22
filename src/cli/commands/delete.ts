/**
 * @copyright Copyright © 2018 - 2026 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { Arguments } from "yargs";
import { Command } from "../../types.js";
import { Options, commonHandler } from "../lib.js";

export { builder } from "../lib.js";

export const command = "delete [-r|--recursive] <args..>";
export const desc =
  "Delete copyright from a list of files (or directories with '--recursive')";

export const handler = (argv: Arguments<Options>): void => {
  commonHandler(argv, Command.Delete);
};
