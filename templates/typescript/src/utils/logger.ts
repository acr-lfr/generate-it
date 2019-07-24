const path = require('path')
const fs = require('fs-extra')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf, colorize } = format
const packageJsonPath = path.join(process.cwd(), 'package.json')
const packageObj = fs.readJsonSync(packageJsonPath)
const appName = packageObj.name || 'app'

// Custom format of the logs
const myFormat = printf((info: any) => {
  let indent
  if (process.env.ENVIRONMENT && process.env.ENVIRONMENT !== 'production') {
    indent = 2
  }
  const message = JSON.stringify(info.message, null, indent)
  return `[${info.label}] ${info.timestamp} ${info.level}: ${message}`
})

// Custom logging handler
const logger = createLogger({
  format: combine(colorize(), label({ label: appName }), timestamp(), myFormat),
  transports: [new transports.Console()],
})

// Override the base console log with winston
console.log = function () {
  return logger.info.apply(logger, arguments)
}
console.error = function () {
  return logger.error.apply(logger, arguments)
}
console.info = function () {
  return logger.warn.apply(logger, arguments)
}
