/**
 * Converts a multi-line string to a single line.
 */
module.exports = (str) => {
  return str ? str.replace(/\n/g, '') : ''
}
