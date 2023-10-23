/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { Arguments } from "yargs";
import { Command } from "../../types";
import { Options, commonHandler } from "../lib";

export { builder } from "../lib";

export const command = "update [-r|--recursive] <args..>";
export const desc =
  "Update or add copyright to a list of files (or directories with '--recursive')";

export const handler = (argv: Arguments<Options>): void => {
  commonHandler(argv, Command.Update);
};
