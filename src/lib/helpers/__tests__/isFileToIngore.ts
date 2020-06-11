import isFileToIngore from '@/lib/helpers/isFileToIngore';

describe('Should no allow directories on black list, eg git idea vscode, even as a file', () => {
  it('should no allow git paths', () => {
    expect(isFileToIngore('som/dir/.git', 'config')).toBe(true);
  });
  it('should no allow idea paths', () => {
    expect(isFileToIngore('som/dir/.idea', 'workspace')).toBe(true);
  });
  it('should no allow vscode paths', () => {
    expect(isFileToIngore('som/dir/.vscode', 'workspace')).toBe(true);
  });

  it('should no allow vscode paths', () => {
    expect(isFileToIngore('som/dir/vscode', '.vscode')).toBe(true);
  });
});

describe('Should other directories in and .njk files', () => {
  it('should allow http paths', () => {
    expect(isFileToIngore('som/dir/http', 'config')).toBe(false);
  });

  it('should allow http paths', () => {
    expect(isFileToIngore('som/dir/http', '___op.njk')).toBe(false);
  });
});
