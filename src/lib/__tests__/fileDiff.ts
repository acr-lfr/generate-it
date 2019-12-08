import fileDiff from '@/lib/diff/fileDiff';
import path from 'path';

it('should return ', async () => {
  const a = path.join(process.cwd(), 'src/lib/__tests__/fileDiff.ts');
  const diff = await fileDiff(a, a);
  expect(diff).toEqual({minus: 0, plus: 0, difference: ''});
});

it('should return ', async () => {
  const a = path.join(process.cwd(), 'src/lib/__tests__/txtFile1.txt');
  const b = path.join(process.cwd(), 'src/lib/__tests__/txtFile2.txt');
  const diff = await fileDiff(a, b);

  expect(diff.minus).toEqual(3);
  expect(diff.plus).toEqual(3);
});
