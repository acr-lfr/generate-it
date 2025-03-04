import shouldCopyOrRenderFile from '@/lib/helpers/shouldCopyOrRenderFile';
import { NodegenRc } from '@/interfaces';

describe('File Ignore Functionality', () => {
  it('should skip .git, node_modules, and editor files', () => {
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'som/dir/.git',
      filenameBeingProcessed: 'config'
    })).toBe(false);
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'som/dir/.idea',
      filenameBeingProcessed: 'workspace'
    })).toBe(false);
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'som/dir/.vscode',
      filenameBeingProcessed: 'workspace'
    })).toBe(false);
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'som/dir/node_modules',
      filenameBeingProcessed: 'workspace'
    })).toBe(false);
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'som/dir/_tpl_testing_/something',
      filenameBeingProcessed: 'workspace'
    })).toBe(false);
  });
  //
  it('should render _tpl_testing_ but not copy them over', () => {
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'render',
      directoryPathContainingFilename: 'som/dir/_tpl_testing_/something',
      filenameBeingProcessed: 'workspace'
    })).toBe(true);
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'som/dir/_tpl_testing_/something',
      filenameBeingProcessed: 'workspace'
    })).toBe(false);
  });

  it('should match exactly', () => {
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'som/dir/.gitignore',
      filenameBeingProcessed: 'config'
    })).toBe(true);
  });

  it('should use configuration from NodegenRc', () => {
    const nodegenRc: NodegenRc = {
      nodegenDir: '',
      nodegenType: '',
      ignoreFiles: ['gradle']
    };

    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'gradle/dir/test',
      filenameBeingProcessed: 'gradle.jar',
      nodegenRc
    })).toBe(false);
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: '.gradle/dir/test',
      filenameBeingProcessed: 'file.png',
      nodegenRc
    })).toBe(false);
  });

  it('should match files using regex', () => {
    const nodegenRc: NodegenRc = {
      nodegenDir: '',
      nodegenType: '',
      ignoreFiles: ['\\.\\w{3}$'] // Ignores any file whose extension is 3 chars
    };

    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'src/main/test',
      filenameBeingProcessed: 'gradle.jar',
      nodegenRc
    })).toBe(false);
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'gradle/dir/test',
      filenameBeingProcessed: 'gradle.jar',
      nodegenRc
    })).toBe(false);
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: '.gradle/dir/test',
      filenameBeingProcessed: 'file.png',
      nodegenRc
    })).toBe(false);
  });

  it('should allow http paths and .njk files', () => {
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'som/dir/http',
      filenameBeingProcessed: 'config'
    })).toBe(true);
    expect(shouldCopyOrRenderFile({
      ignoreForWhichAction: 'copy',
      directoryPathContainingFilename: 'som/dir/http',
      filenameBeingProcessed: '___op.njk'
    })).toBe(true);
  });
});
