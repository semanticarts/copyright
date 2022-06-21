/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import fs from "fs-extra";
import glob from "glob";

import { ArgError } from "./cli/errors";
import config from "./config";
import testFile, { displayPath } from "./testFile";

import { Command, Mode } from "./types";

function getFiles(src: string): string[] {
  const matches = glob.sync(`${src}/**/*.*`, {
    ignore: config.options.ignoreDirs,
  });
  return matches;
}

interface FailedResult {
  error: Error;
  filepath: string;
}

/**
 * Update or delete the copyright of a selective list of files
 *
 * @param filepaths The list of files to test
 * @param command The copyright command
 */
function runCopyrightOnFiles(filepaths: string[], command: Command): void {
  const edited: string[] = [];
  const failed: FailedResult[] = [];
  // eslint-disable-next-line dot-notation
  const root = process.env["PWD"] as string;

  filepaths.forEach((filepath) => {
    const { fileModern, error } = testFile(filepath, root, command);
    if (error) {
      failed.push({ filepath, error } as FailedResult);
    } else if (!fileModern) {
      edited.push(filepath);
    }
  });

  if (edited.length === 0 && failed.length === 0) {
    console.info(
      "All files in this project have the correct copyright information!\nNo action required.\n"
    );
  } else if (edited.length > 0) {
    console.info(
      "There were files in this project that had incorrect copyright information, but have been fixed:"
    );
    console.info(
      edited
        .map((filepath: string) => displayPath(filepath, root))
        .map((filepath: string) => `-> ${filepath}`)
        .join("\n")
    );
  }

  if (failed.length > 0) {
    console.warn(
      "Some files failed to process. You may have to edit these by hand: "
    );
    console.warn(
      failed
        .map(({ filepath, error }) => {
          const nicePath = displayPath(filepath, root);
          return ` -> File ${nicePath} failed for reason: ${error}`;
        })
        .join("\n")
    );
  }
}

/**
 * Collect all files from files/directories passed in.
 *
 * @param filepaths The files/directories to collect files from
 * @param mode The mode, either recursive or selective
 * @returns All mined files in directories
 * @throws {ArgError} If a directory is found without the recursive option
 */
function collectFiles(fileOrDirPaths: string[], mode: Mode): string[] {
  const files: string[] = [];
  fileOrDirPaths.forEach((fileOrDirPath) => {
    const stats: fs.Stats = fs.statSync(fileOrDirPath);

    if (stats.isDirectory() && mode === Mode.Selective) {
      throw new ArgError(
        `Error: The filepath ${fileOrDirPath} is a directory. Did you mean to enable '--recursive'?`
      );
    } else if (stats.isDirectory() && mode === Mode.Recursive) {
      files.push(...getFiles(fileOrDirPath));
    } else if (stats.isFile()) {
      files.push(fileOrDirPath);
    }
  });

  return files;
}

/**
 * Run the copyright script.
 *
 * @param filepaths The filepaths passed in by the user. They have been vetted
 *      to exist,  but may be files OR directories.
 * @param command The command, either Update or Delete
 * @param mode The mode, either Recursive or Selective
 */
export default function copyright(
  filepaths: string[],
  command: Command,
  mode: Mode
) {
  const collectedFiles = collectFiles(filepaths, mode);
  runCopyrightOnFiles(collectedFiles, command);
}
