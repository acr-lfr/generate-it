import path from 'path';

export default (dir: any) => {
  return path.join(process.cwd(), dir);
};
