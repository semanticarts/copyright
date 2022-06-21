/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import fs from "fs-extra";
import child from "child_process";
import path from "path";

import { copyrightProject, scriptPath } from "./test-lib";
import { Command, Mode } from "../src/types";

const testDir = path.join(copyrightProject, "test");
const tempDir = path.join(testDir, "tmp");
const testDataDir = path.join(testDir, "data");

const cleanup = () => {
  fs.rmSync(tempDir, { recursive: true, force: true });
};

const startup = () => {
  cleanup();

  try {
    fs.mkdirSync(tempDir);
  } catch (error) {
    console.error(`Not creating directory at path ${tempDir}, already exists!`);
    console.error(error);
  }
};

/**
 * Run copyright on a single file
 *
 * @param tempCommand
 * @param tempPath
 * @param idealData
 * @param casePath
 */
const testCase = (
  tempCommand: Command,
  tempPath: string,
  idealData: string,
  casePath: string
) => {
  fs.copyFileSync(casePath, tempPath);

  child.execSync(`node ${scriptPath} ${tempCommand} ${tempPath}`);

  const endData = fs.readFileSync(tempPath, { encoding: "utf-8" });
  expect(endData).toEqual(idealData);
};

const forEachExtension = (
  dataPath: string,
  callback: (ext: string) => void
) => {
  fs.readdirSync(dataPath).forEach((ext) => {
    // Removes .DS_Store and other undesirable directories
    if (ext[0] === ".") {
      return;
    }

    describe(`extension: .${ext}`, () => {
      callback(ext);
    });
  });
};

/**
 * Run callback for each file in @param directory. Assumes existence.
 * @param {string} directory The filepath of the directory to read files out of
 * @param {Function} callback
 */
const forEachFile = (
  directory: string,
  callback: (filename: string) => void
) => {
  fs.readdirSync(directory).forEach((filename) => {
    callback(filename);
  });
};

const forEachMode = (callback: (mode: Mode) => void) => {
  [Mode.Selective, Mode.Recursive].forEach((mode) =>
    describe(`mode: ${mode}`, () => {
      callback(mode);
    })
  );
};

const forEachCommand = (callback: (command: Command) => void) => {
  [Command.Update, Command.Delete].forEach((command) => {
    describe(`command: ${command}`, () => {
      callback(command);
    });
  });
};

/**
 * Get the ideal data for a specific configuration.
 * Either in ideal.${ext} or noCopyright.${ext}
 *
 * @param directory - The data directory, e.g. 'html-data' or 'md-data'
 * @param ext - The extension with NO period, e.g. 'js' or 'md'
 * @param command
 */
const getIdealData = (directory: string, ext: string, command: Command) => {
  let idealPath;
  switch (command) {
    case Command.Update:
      idealPath = path.join(directory, `currentWithNewline.${ext}`);
      break;
    case Command.Delete:
      idealPath = path.join(directory, `noCopyright.${ext}`);
      break;
    default:
      throw Error("Wrong command!");
  }

  const idealData = fs.readFileSync(idealPath, { encoding: "utf-8" });
  return idealData;
};

describe("Copyright script itself", () => {
  // For some reason beforeAll here or outside of the upper describe
  // doesn't work. Here works, though.
  startup();

  forEachCommand((command) => {
    const commandSpecificDir = path.join(tempDir, command);
    fs.mkdirSync(commandSpecificDir);

    forEachMode((mode) => {
      const modeSpecificDir = path.join(commandSpecificDir, mode);
      fs.mkdirSync(modeSpecificDir);

      forEachExtension(testDataDir, (ext) => {
        const extSpecificTestDir = path.join(modeSpecificDir, ext);
        fs.mkdirSync(extSpecificTestDir);

        const extSpecificDataDir = path.join(testDataDir, ext);
        const idealData = getIdealData(extSpecificDataDir, ext, command);

        if (mode === Mode.Selective) {
          // Selective mode works on files, so do one for each file
          forEachFile(extSpecificDataDir, (filename) => {
            const testFilePath = path.join(extSpecificDataDir, filename);
            const tempPath = path.join(extSpecificTestDir, `tmp.${ext}`);

            // For every testable file within that extension type
            it(`tests ${filename}`, () => {
              testCase(command, tempPath, idealData, testFilePath);
            });
          });
        } else if (mode === Mode.Recursive) {
          // Recursive mode works on directories, so do a single one per extension
          fs.copySync(extSpecificDataDir, extSpecificTestDir, {
            overwrite: true,
          });
          child.execSync(
            `node ${scriptPath} ${command} -r ${extSpecificTestDir}`
          );

          // Test that all files look ideal
          forEachFile(extSpecificDataDir, (filename) => {
            const testFilePath = path.join(extSpecificTestDir, filename);

            // For every testable file within that extension type
            it(`tests ${filename}`, () => {
              const endData = fs.readFileSync(testFilePath, {
                encoding: "utf-8",
              });
              expect(endData).toEqual(idealData);
            });
          });
        }
      });
    });
  });

  afterAll(cleanup);
});
