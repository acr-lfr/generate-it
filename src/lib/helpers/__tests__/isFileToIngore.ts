import isFileToIngore from '@/lib/helpers/isFileToIngore';

describe('Should not allow directories on black list, eg git idea vscode, even as a file', () => {
  it('should skip .git, node_modules, and editor files', () => {
    expect(isFileToIngore('som/dir/.git', 'config')).toBe(true);
    expect(isFileToIngore('som/dir/.idea', 'workspace')).toBe(true);
    expect(isFileToIngore('som/dir/.vscode', 'workspace')).toBe(true);
    expect(isFileToIngore('som/dir/vscode', '.vscode')).toBe(true);
    expect(isFileToIngore('som/dir/.vscode/blah', 'workspace')).toBe(true);
    expect(isFileToIngore('som/dir/node_modules/blah', 'workspace')).toBe(true);
    expect(isFileToIngore('som/dir/node_modules', 'workspace')).toBe(true);
    expect(isFileToIngore('som/dir/node_modules/', 'workspace')).toBe(true);
  });

  it('should match exactly', () => {
    expect(isFileToIngore('som/dir/.gitignore', 'config')).toBe(false);
  });
});

describe('Should other directories in and .njk files', () => {
  it('should allow http paths', () => {
    expect(isFileToIngore('som/dir/http', 'config')).toBe(false);
    expect(isFileToIngore('som/dir/http', '___op.njk')).toBe(false);
  });
});
