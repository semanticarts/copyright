/**
 * @copyright Copyright © 2018 - 2023 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { Arguments } from "yargs";
import { Command } from "../../types";
import { Options, commonHandler } from "../lib";

export { builder } from "../lib";

export const command = "delete [-r|--recursive] <args..>";
export const desc =
  "Delete copyright from a list of files (or directories with '--recursive')";

export const handler = (argv: Arguments<Options>): void => {
  commonHandler(argv, Command.Delete);
};
