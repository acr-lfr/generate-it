const _ = require('lodash')
/**
 * Converts a string to its camel-cased version.
 */
module.exports = (str) => {
  return _.camelCase(str)
}
