import _ from 'lodash';

export const SHOULD_PLURAL = ['Route', 'TransformInputs', 'TransformOutputs', 'Validator'];
export const FUNCS_DIRS = ['routes', 'transformInputs', 'transformOutputs', 'validators'];

class NamingUtils {
  public generateOperationSuffix (subdir: string, operation: string, ext: string) {
    const subDirSplit = subdir.split('/');
    let suffix = subDirSplit[subDirSplit.length - 1];
    if (suffix.indexOf('__') !== -1) {
      // remove the __ and grab the next path segment
      let start = subDirSplit[subDirSplit.length - 2];
      start = start.substring(0, start.length - 1);
      suffix = start + _.upperFirst(suffix.split('__').join(''));
    }
    suffix = suffix.charAt(0).toUpperCase() + suffix.substring(1, suffix.length - 1);
    if (SHOULD_PLURAL.includes(suffix)) {
      suffix += 's';
    }
    operation = _.camelCase(operation);
    if (!FUNCS_DIRS.includes(subDirSplit[subDirSplit.length - 1])) {
      operation = operation.charAt(0).toUpperCase() + operation.substring(1);
    }

    return operation + suffix + '.' + ext;
  }

  /**
   * Will camel case a snake case input
   * @param value
   * @return {*|string}
   */
  public fixRouteName (value: string): string {
    const index = value.indexOf('-');
    if (index !== -1) {
      const charAfter = value.charAt(index + 1).toUpperCase();
      value = value.substring(0, index) + charAfter + value.substring(index + 2);
      return this.fixRouteName(value);
    } else {
      return value;
    }
  }

  /**
   * Strips out the njk ext from a given string
   * @param input
   * @return {string | *}
   */
  public stripNjkExtension (input: string): string {
    if (input.substring(input.length - 4) === '.njk') {
      return input.substring(0, input.length - 4);
    } else {
      return input;
    }
  }

  /**
   * Returns file extensions of a string, eg:
   * test.js -> js
   * test.js.njk -> js
   * test.spec.js.njk -> spec.js
   * test.spec.js -> spec.js
   * @param filename
   * @return {string}
   */
  public getFileExt (filename: string): string {
    const parts = filename.split('.');
    if (parts[parts.length - 1] === 'njk') {
      parts.pop();
    }
    if (filename.charAt(0) !== '.') {
      // not a dot file, shift out 1st section
      parts.shift();
    }
    // This is a "dot" file, eg .nodegenrc, or, .nodegenrc.json
    return parts.join('.');
  }
}

export default new NamingUtils();
