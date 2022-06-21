/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import util from "util";

import * as child from "child_process";
import { scriptPath } from "./test-lib";

const exec = util.promisify(child.exec);

type ExecResult = { stdout: string; stderr: string };

/**
 * @param command The command to run
 */
async function runTest(command: string): Promise<ExecResult> {
  let result: ExecResult;
  try {
    result = await exec(command);
  } catch (error) {
    result = error as ExecResult;
  }

  return result;
}

describe("Copyright script interface", () => {
  it("tests no commands", async () => {
    const command = `node ${scriptPath}`;
    const { stdout, stderr } = await runTest(command);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
    expect(stderr).toContain("delete");
  });

  it("tests bad first command", async () => {
    const command = `node ${scriptPath} bad_command`;
    const { stdout, stderr } = await runTest(command);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
  });

  it("tests good first command (update), missing second", async () => {
    const command = `node ${scriptPath} update`;
    const { stdout, stderr } = await runTest(command);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
    expect(stderr).toContain("recursive");
  });

  it("tests two bad commands", async () => {
    const command = `node ${scriptPath} bad1 bad2`;
    const { stdout, stderr } = await runTest(command);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
    expect(stderr).toContain("delete");
    expect(stderr).toContain("recursive");
  });

  it("tests no argument for recursive", async () => {
    const command = `node ${scriptPath} update --recursive`;
    const { stdout, stderr } = await runTest(command);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
    expect(stderr).toContain("delete");
    expect(stderr).toContain("recursive");
  });

  it("tests too many arguments for recursive", async () => {
    const command = `node ${scriptPath} update --recursive a b c`;
    const { stdout, stderr } = await runTest(command);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("update");
    expect(stderr).toContain("recursive");
  });

  it("tests arguments for selective that don't exist", async () => {
    const command = `node ${scriptPath} update selective a b c/d/e`;
    const { stdout, stderr } = await runTest(command);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("not exist");
    expect(stderr).toContain("a");
    expect(stderr).toContain("b");
    expect(stderr).toContain("c/d/e");
  });

  it("tests argument for recursive that doesn't exist", async () => {
    const command = `node ${scriptPath} update recursive a`;
    const { stdout, stderr } = await runTest(command);

    expect(stdout).toStrictEqual("");
    expect(stderr).toContain("not exist");
    expect(stderr).toContain("a");
  });
});
