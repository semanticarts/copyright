#!/usr/bin/env node

/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

function main() {
  // eslint-disable-next-line no-unused-expressions
  yargs(hideBin(process.argv))
    .usage("Usage: $0 <command> [-r|--recursive] <args..>")
    .commandDir("commands")
    .strict()
    .demandCommand(1)
    .alias({ h: "help", v: "version", r: "recursive" }).argv;
}

main();
