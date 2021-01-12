export default (dir: string, filename: string) => {
  return /(\.idea|\.git|\.vscode|node_modules)\b/.test(`${dir}/${filename}`);
};
