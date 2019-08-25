const validHttpMethods = require('../../validHttpMethods')
/**
 * Checks if a method is a valid HTTP method.
 */
module.exports = (method) => {
  return (validHttpMethods.indexOf(method.toUpperCase()) !== -1)
}
