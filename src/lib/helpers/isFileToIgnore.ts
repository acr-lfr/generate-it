import { NodegenRc } from '@/interfaces';
import path from 'path';

const defaultIgnoreList = [`(\\.idea|\\.git|\\.vscode|node_modules|build|dist|_tpl_testing_)\\b`];
let ignoreList: string;
let fullRegex: RegExp;

/**
 * Finds if the file should be ignored during copying
 * @param dir The dir that contains the file
 * @param filename The filename, not much to add here
 * @param [nodegenRc] The template configuration data
 */
export default (dir: string, filename: string, nodegenRc?: NodegenRc) => {
  let filesToIgnore = nodegenRc?.ignoreFiles ?? defaultIgnoreList;
  filesToIgnore = Array.isArray(filesToIgnore) ? filesToIgnore : [filesToIgnore];
  filesToIgnore = filesToIgnore.join('|');

  if (!fullRegex || filesToIgnore !== ignoreList) {
    ignoreList = filesToIgnore;
    fullRegex = new RegExp(filesToIgnore);
  }

  return fullRegex.test(path.join(dir, filename));
};
