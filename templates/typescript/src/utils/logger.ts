import path from 'path';
import fs from 'fs-extra';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, colorize } = format;
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageObj = fs.readJsonSync(packageJsonPath);
const name = packageObj.name || 'app';

// Custom format of the logs
const myFormat = printf((info: any) => {
  let indent;
  if (process.env.ENVIRONMENT && process.env.ENVIRONMENT !== 'production') {
    indent = 2;
  }
  const message = JSON.stringify(info.message, null, indent);
  return `[${info.label}] ${info.timestamp} ${info.level}: ${message}`;
});

// Custom logging handler
const logger = createLogger({
  format: combine(colorize(), label({ label: name }), timestamp(), myFormat),
  transports: [new transports.Console()],
});

// Override the base console log with winston
// console.log = logger.info
console.warn = logger.warn;
console.error = logger.error;
