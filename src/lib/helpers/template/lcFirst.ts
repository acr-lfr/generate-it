/**
 *
 * @param inputString to ucfirst
 * @returns {string}
 */
export default (inputString: string): string => {
  if (typeof inputString !== 'string') {
    throw new Error('Param passed to lcfirst is not type string but type: ' + typeof inputString);
  }
  return inputString.charAt(0).toLowerCase() + inputString.slice(1);
};
