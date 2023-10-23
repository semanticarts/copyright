/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

import { createLogger, transports } from "winston";

const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/logfile.log" }),
  ],
});

export default logger;
