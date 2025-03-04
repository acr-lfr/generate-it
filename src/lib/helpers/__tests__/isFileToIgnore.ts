import isFileToIgnore from '@/lib/helpers/isFileToIgnore';
import { NodegenRc } from '@/interfaces';

describe('Should not allow directories on black list, eg git idea vscode, even as a file', () => {
  it('should skip .git, node_modules, and editor files', () => {
    expect(isFileToIgnore('som/dir/.git', 'config')).toBe(true);
    expect(isFileToIgnore('som/dir/.idea', 'workspace')).toBe(true);
    expect(isFileToIgnore('som/dir/.vscode', 'workspace')).toBe(true);
    expect(isFileToIgnore('som/dir/vscode', '.vscode')).toBe(true);
    expect(isFileToIgnore('som/dir/.vscode/blah', 'workspace')).toBe(true);
    expect(isFileToIgnore('som/dir/node_modules/blah', 'workspace')).toBe(true);
    expect(isFileToIgnore('som/dir/node_modules', 'workspace')).toBe(true);
    expect(isFileToIgnore('som/dir/node_modules/', 'workspace')).toBe(true);
    expect(isFileToIgnore('som/dir/_tpl_testing_/', 'workspace')).toBe(true);
    expect(isFileToIgnore('som/_tpl_testing_/nested/dir', 'workspace')).toBe(true);
  });

  it('should match exactly', () => {
    expect(isFileToIgnore('som/dir/.gitignore', 'config')).toBe(false);
  });

  it('should use configuration from Nodegenrc', () => {
    const nodegenRc: NodegenRc = {
      nodegenDir: '',
      nodegenType: '',
      ignoreFiles: [
        'gradle',
      ]
    };

    expect(isFileToIgnore('.git/dir/', 'config', nodegenRc)).toBe(false);
    expect(isFileToIgnore('som/dir/.idea', 'workspace', nodegenRc)).toBe(false);
    expect(isFileToIgnore('som/dir/.vscode', 'workspace', nodegenRc)).toBe(false);
    expect(isFileToIgnore('som/dir/node_modules/blah', 'workspace', nodegenRc)).toBe(false);
    expect(isFileToIgnore('gradle/dir/test', 'gradle.jar', nodegenRc)).toBe(true);
    expect(isFileToIgnore('.gradle/dir/test', 'file.png', nodegenRc)).toBe(true);
  });

  it('should match files using regex', () => {
    const nodegenRc: NodegenRc = {
      nodegenDir: '',
      nodegenType: '',
      ignoreFiles: [
        '\\.\\w{3}$', // Ignores any file whose extension is 3 chars
      ]
    };

    expect(isFileToIgnore('src', 'node.js', nodegenRc)).toBe(false);
    expect(isFileToIgnore('src/main/java', '.Dockerfile', nodegenRc)).toBe(false);
    expect(isFileToIgnore('src/main/test', 'gradle.jar', nodegenRc)).toBe(true);
    expect(isFileToIgnore('gradle/dir/test', 'gradle.jar', nodegenRc)).toBe(true);
    expect(isFileToIgnore('.gradle/dir/test', 'file.png', nodegenRc)).toBe(true);
  });
});

describe('Should other directories in and .njk files', () => {
  it('should allow http paths', () => {
    expect(isFileToIgnore('som/dir/http', 'config')).toBe(false);
    expect(isFileToIgnore('som/dir/http', '___op.njk')).toBe(false);
  });
});
