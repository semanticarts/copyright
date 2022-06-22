/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import config from "../config";
import { ExtensionNotFoundError } from "../errors";
import {
  shouldIgnoreFile,
  displayPath,
  getExtensionRuleByExtension,
} from "./generic";

describe("shouldIgnoreFile()", () => {
  it("should ignore dot files", () => {
    expect(shouldIgnoreFile(".file")).toBe(true);
    expect(shouldIgnoreFile(".py")).toBe(true);
    expect(shouldIgnoreFile("some/long/relative/path/.py")).toBe(true);
    expect(shouldIgnoreFile("/long/absolute/path/.py")).toBe(true);
    expect(shouldIgnoreFile(".js")).toBe(true);
  });

  it("should not ignore supported files", () => {
    expect(shouldIgnoreFile("some_file.js")).toBe(false);
    expect(shouldIgnoreFile("some_file.jsx")).toBe(false);
    expect(shouldIgnoreFile("some_file.ts")).toBe(false);
    expect(shouldIgnoreFile("some_file.tsx")).toBe(false);
    expect(shouldIgnoreFile("some_file.py")).toBe(false);
    expect(shouldIgnoreFile("some_file.html")).toBe(false);
    expect(shouldIgnoreFile("some_file.md")).toBe(false);
    expect(shouldIgnoreFile("some_file.trig")).toBe(false);
    expect(shouldIgnoreFile("some_file.ttl")).toBe(false);
    expect(shouldIgnoreFile("some_file.nq")).toBe(false);
  });
});

describe("getExtensionRuleByExtension()", () => {
  it("finds the correct rule", () => {
    expect(
      getExtensionRuleByExtension("js", config.rules).extensions
    ).toContain("js");
  });

  it("throws an error on unsupported rule", () => {
    try {
      getExtensionRuleByExtension("not supported", config.rules);
    } catch (error) {
      expect(error).toBeInstanceOf(ExtensionNotFoundError);
    }
  });
});

describe("displayPath()", () => {
  it("works correctly", () => {
    expect(displayPath("/some/file/path", "/some/file/")).toBe("path");
    expect(displayPath("some/relative/path", "something else")).toBe(
      "some/relative/path"
    );
  });
});
