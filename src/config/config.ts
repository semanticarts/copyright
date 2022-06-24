/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { cosmiconfigSync } from "cosmiconfig";

import { CopyrightConfig } from "../types";
import ConfigBuilder from "./config-builder";

export function resolveConfig(): CopyrightConfig {
  const explorer = cosmiconfigSync("copyright", {
    searchPlaces: ["package.json", ".copyrightrc.js", "copyright.config.js"],
  });

  const result = explorer.search();

  if (!result) {
    throw Error(
      "Config was not found! Either include a '.copyrightrc.js' or 'copyright.config.js' file, or a \"copyright\" key in your package.json"
    );
  }

  const config = ConfigBuilder.buildConfig(result.config);
  return config;
}

export default resolveConfig();
