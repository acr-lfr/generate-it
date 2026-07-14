import path from 'path';

export default (dir: any) => {
  return path.resolve(process.cwd(), dir);
};
