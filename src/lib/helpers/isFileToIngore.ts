export default (dir: string, filename: string) => {
  const prohibited = ['.git', '.idea', '.vscode'];
  for (let i = 0; i < prohibited.length; i++) {
    if (dir.indexOf(prohibited[i]) !== -1) {
      return true;
    }
    if (filename === prohibited[i]) {
      return true;
    }
  }
  return false;
};
