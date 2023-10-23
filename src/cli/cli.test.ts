/**
 * @copyright Copyright © 2018 - 2023 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import child from "child_process";
import util from "util";
import path from "path";

import { Command, Mode } from "../types";

const scriptPath = path.join("./", "dist/src/cli/cli.js");

const exec = util.promisify(child.exec);

interface ExecResult {
  stdout: string;
  stderr: string;
}

async function runTest(
  command: Command | string = "",
  mode: Mode | string = "",
  args: string[] = []
): Promise<{ stdout: string; stderr: string }> {
  let result: ExecResult;
  try {
    let shellCommand = `node ${scriptPath}`;
    shellCommand += command ? ` ${command}` : "";
    shellCommand += mode && mode === Mode.Recursive ? " --recursive" : "";
    shellCommand += ` ${args.join(" ")}`;

    result = await exec(shellCommand);
  } catch (error) {
    result = error as ExecResult;
  }

  return result;
}

describe("Copyright script interface", () => {
  it("tests no commands", async () => {
    const { stdout, stderr } = await runTest();
    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
  });

  it("tests bad first command", async () => {
    const { stdout, stderr } = await runTest("bad_command");

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
  });

  it("tests directory argument for selective mode", async () => {
    const { stdout, stderr } = await runTest(Command.Delete, Mode.Selective, [
      "./",
    ]);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("directory");
    expect(stderr).toContain("--recursive");
  });

  it("tests good first command (update), missing second", async () => {
    const { stdout, stderr } = await runTest(Command.Update);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
    expect(stderr).toContain("recursive");
  });

  it("tests two bad commands", async () => {
    const { stdout, stderr } = await runTest("bad1", "bad2");

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
    expect(stderr).toContain("delete");
    expect(stderr).toContain("recursive");
  });

  it("tests no argument for recursive", async () => {
    const { stdout, stderr } = await runTest(Command.Update, Mode.Recursive);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
    expect(stderr).toContain("delete");
    expect(stderr).toContain("recursive");
  });

  it("tests too many arguments for recursive", async () => {
    const { stdout, stderr } = await runTest(Command.Update, Mode.Recursive, [
      "a",
      "b",
      "c",
    ]);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
    expect(stderr).toContain("recursive");
  });

  it("tests arguments for selective that don't exist", async () => {
    const { stdout, stderr } = await runTest(Command.Update, Mode.Selective, [
      "a",
      "b",
      "c/d/e",
    ]);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("not exist");
    expect(stderr).toContain("a");
    expect(stderr).toContain("b");
    expect(stderr).toContain("c/d/e");
  });

  it("tests argument for recursive that doesn't exist", async () => {
    const { stdout, stderr } = await runTest(Command.Update, Mode.Recursive, [
      "a",
    ]);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("not exist");
    expect(stderr).toContain("a");
  });
});
