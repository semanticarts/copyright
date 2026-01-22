#!/usr/bin/env node

/**
 * @copyright Copyright © 2018 - 2026 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  command as updateCmd,
  desc as updateDesc,
  builder as updateBuilder,
  handler as updateHandler,
} from "./commands/update.js";
import {
  command as deleteCmd,
  desc as deleteDesc,
  builder as deleteBuilder,
  handler as deleteHandler,
} from "./commands/delete.js";

export default function main() {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  yargs(hideBin(process.argv))
    .usage("Usage: $0 <command> [-r|--recursive] <args..>")
    .command(updateCmd, updateDesc, updateBuilder, updateHandler)
    .command(deleteCmd, deleteDesc, deleteBuilder, deleteHandler)
    .strict()
    .demandCommand(1)
    .alias({ h: "help", v: "version", r: "recursive" }).argv;
}

main();
