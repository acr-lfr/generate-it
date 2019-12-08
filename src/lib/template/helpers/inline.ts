/**
 * Converts a multi-line string to a single line.
 */
export default (str: string) => {
  return str ? str.replace(/\n/g, '') : '';
};
