/**
 * Checks if a string ends with a provided value.
 */
export default (subject: string, endvalue: string) => {
  return String(subject)[subject.length - 1] === String(endvalue);
};
