/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

/**
 * @copyright Copyright © 2018 - {{{currentYear}}} by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import {
  CopyrightConfig,
  CopyrightConfigOptions,
  CopyrightConfigRules,
  ExtensionRule,
} from "../types";

export default class ConfigBuilder {
  private rules: CopyrightConfigRules;

  private options: CopyrightConfigOptions;

  constructor() {
    this.rules = {};
    this.options = {
      ignoreDirs: [],
      ignoreStartsWithDot: true,
      whitelistDirs: [],
    };
  }

  addExtensionRule(ruleKey: string, extensionRule: ExtensionRule): void {
    this.rules[ruleKey] = extensionRule;
  }

  build(): CopyrightConfig {
    return { rules: this.rules, options: this.options };
  }
}
