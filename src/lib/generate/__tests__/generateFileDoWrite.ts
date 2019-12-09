import path from 'path';
import generateFileDoWrite from '@/lib/generate/generateFileDoWrite';

const tplPath = 'src/lib/generate/__tests__/generateFileDoWrite.ts';
const thisFilePath = path.join(process.cwd(), tplPath);

it('should return true for 1st run', () => {
  expect(
    generateFileDoWrite(
      true,
      thisFilePath,
      '/',
      'http/nodegen',
    ),
  ).toBe(true);
});

it('should return true for tpl file that does not exist', () => {
  expect(
    generateFileDoWrite(
      false,
      'some/path/that/deoesnot/exist',
      tplPath,
      'src/lib',
    ),
  ).toBe(true);
});

it('should return true', () => {
  expect(
    generateFileDoWrite(
      false,
      thisFilePath,
      tplPath,
      'src/lib',
    ),
  ).toBe(true);
});

it('should return true', () => {
  expect(
    generateFileDoWrite(
      false,
      thisFilePath,
      tplPath,
      'src/nodegen',
    ),
  ).toBe(false);
});
