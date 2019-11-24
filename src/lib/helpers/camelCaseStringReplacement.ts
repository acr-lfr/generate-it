import lcFirst from '@/lib/helpers/template/lcFirst';
import ucFirst from '@/lib/helpers/template/ucFirst';

/**
 *
 * @param input
 * @param {string|array} replace - String or array of string replacements
 * @return {string}
 */
export default (input: string, replace: string | string[]) => {
  if (typeof replace === 'string') {
    replace = [replace];
  }
  if (!Array.isArray(replace)) {
    throw Error('The replace values must be either a string or an array of strings.');
  }
  let returnString = '';
  replace.forEach((replaceItem, i) => {
    const replaceInString = (i === 0) ? input : returnString;
    returnString = lcFirst((replaceInString.split(replaceItem).map((part) => {
      return ucFirst(part);
    })).join(''));
  });
  return returnString;
};
