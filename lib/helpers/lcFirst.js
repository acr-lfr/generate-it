/**
 *
 * @param string to ucfirst
 * @returns {string}
 */
module.exports = (string) => {
  if (typeof string !== 'string') {
    throw new Error('Param passed to lcfirst is not type string but type: ' + typeof string)
  }
  return string.charAt(0).toLowerCase() + string.slice(1)
}
