/**
 *
 * @param inputString to ucfirst
 * @returns {string}
 */
export default (inputString: string): string => {
  if (typeof inputString !== 'string') {
    throw new Error('Param passed to ucfirst is not type string but type: ' + typeof inputString);
  }
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};
