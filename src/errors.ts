/**
 * @copyright Copyright © 2018 - 2023 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

/* eslint-disable max-classes-per-file */
export class ArgError extends Error {
  constructor(message: string) {
    super(`ArgError: ${message}`);
    this.name = "ArgError";
  }
}

export class ExtensionNotFoundError extends Error {
  constructor(message: string) {
    super(`ExtensionNotFoundError: ${message}`);
    this.name = "ExtensionNotFoundError";
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export class ConfigValidationError extends ConfigError {
  constructor(message: string) {
    super(`ConfigValidationError: ${message}`);
    this.name = "ConfigValidationError";
  }
}

export class ConfigNotFoundError extends ConfigError {
  constructor(message: string) {
    super(`ConfigNotFoundError: ${message}`);
    this.name = "ConfigNotFoundError";
  }
}
