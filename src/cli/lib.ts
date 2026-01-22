/**
 * @copyright Copyright © 2018 - 2026 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import fs from "fs-extra";
import { Argv, Arguments } from "yargs";

import copyright from "../copyright.js";

import { Command, Mode } from "../types.js";
import { ArgError } from "../errors.js";

export type Options = {
  args: string[];
  recursive: boolean | undefined;
};

export const builder = (args: Argv) =>
  args
    .options({
      recursive: {
        type: "boolean",
        description: "Update/delete copyright from trees of files",
      },
    })
    .positional("args", {
      array: true,
      type: "string",
      coerce: (files: string[]) => {
        if (files.length === 0) {
          throw Error("Error: no arguments included!");
        }

        const nonexistentFiles = files.reduce(
          (nonexistent: string[], filepath: string) => {
            if (!fs.existsSync(filepath)) {
              return [...nonexistent, filepath];
            }
            return nonexistent;
          },
          [],
        );

        if (nonexistentFiles.length === 1) {
          throw Error(`Error: file '${nonexistentFiles.pop()}' does not exist`);
        } else if (nonexistentFiles.length > 1) {
          const message = `Error: some files did not exist:\n${nonexistentFiles
            .map((filepath) => `  -> ${filepath}\n`)
            .join("")}`;

          throw Error(message);
        }

        return files;
      },
      demandOption: true,
    });

/**
 * The common handler both update and delete use, parameterized by command.
 *
 * @param argv The argv object given by yargs
 * @param command The command, either Delete or Update
 */
export const commonHandler = (
  argv: Arguments<Options>,
  command: Command,
): void => {
  const { recursive, args } = argv;

  const mode: Mode = recursive ? Mode.Recursive : Mode.Selective;
  try {
    copyright(args, command, mode);
  } catch (error) {
    if (error instanceof ArgError) {
      console.error("Use --help for usage information.");
    }

    console.error((error as Error).message);
    process.exit(1);
  }

  process.exit(0);
};
