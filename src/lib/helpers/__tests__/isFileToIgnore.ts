import isFileToIgnore from '@/lib/helpers/isFileToIgnore';

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
  });

  it('should match exactly', () => {
    expect(isFileToIgnore('som/dir/.gitignore', 'config')).toBe(false);
  });
});

describe('Should other directories in and .njk files', () => {
  it('should allow http paths', () => {
    expect(isFileToIgnore('som/dir/http', 'config')).toBe(false);
    expect(isFileToIgnore('som/dir/http', '___op.njk')).toBe(false);
  });
});
