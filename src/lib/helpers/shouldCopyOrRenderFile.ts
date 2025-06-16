import { NodegenRc } from '@/interfaces';
import path from 'path';

const defaultCopyIgnoreList = [`(\\.idea|\\.git|\\.vscode|node_modules|build\/|dist\/|_tpl_testing_)\\b`];
const defaultRenderIgnoreList = [`(\\.idea|\\.git|\\.vscode|node_modules|build\/|dist\/)\\b`];
let ignoreList: string;
let fullRegex: RegExp;

export default (input: {
  ignoreForWhichAction: 'copy' | 'render'
  directoryPathContainingFilename: string,
  filenameBeingProcessed: string,
  nodegenRc?: NodegenRc
}) => {

  let filesToIgnore = input.nodegenRc?.ignoreFiles ??
    (input.ignoreForWhichAction === 'copy' ? defaultCopyIgnoreList :
      input.ignoreForWhichAction === 'render' ? defaultRenderIgnoreList : undefined);

  filesToIgnore = Array.isArray(filesToIgnore) ? filesToIgnore : [filesToIgnore];
  filesToIgnore = filesToIgnore.join('|');

  if (!fullRegex || filesToIgnore !== ignoreList) {
    ignoreList = filesToIgnore;
    fullRegex = new RegExp(filesToIgnore);
  }

  return !fullRegex.test(
    path.join(input.directoryPathContainingFilename, input.filenameBeingProcessed)
  );
};
