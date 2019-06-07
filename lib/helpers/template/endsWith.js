/**
 * Checks if a string ends with a provided value.
 */
module.exports = (subject, endvalue) => {
  return (String(subject)[subject.length -1] === String(endvalue))
}
