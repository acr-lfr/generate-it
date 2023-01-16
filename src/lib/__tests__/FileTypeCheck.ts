import FileTypeCheck from '@/lib/FileTypeCheck';

it('OP return true', () => {
  expect(FileTypeCheck.isOpertationFile('___op.js.njk')).toBe(true);
});
it('OP return false', () => {
  expect(FileTypeCheck.isOpertationFile('__op.js.njk')).toBe(false);
  expect(FileTypeCheck.isOpertationFile('___OP.js.njk')).toBe(false);
  expect(FileTypeCheck.isOpertationFile('bob')).toBe(false);
});

it('MOCK return true', () => {
  expect(FileTypeCheck.isMockFile('___mock.js.njk')).toBe(true);
});
it('MOCK return false', () => {
  expect(FileTypeCheck.isMockFile('__mock.js.njk')).toBe(false);
  expect(FileTypeCheck.isMockFile('___MOCK.js.njk')).toBe(false);
  expect(FileTypeCheck.isMockFile('bob')).toBe(false);
});

it('STUB return true', () => {
  expect(FileTypeCheck.isStubFile('___stub.js.njk')).toBe(true);
});
it('STUB return false', () => {
  expect(FileTypeCheck.isStubFile('__stub.js.njk')).toBe(false);
  expect(FileTypeCheck.isStubFile('___STUB.js.njk')).toBe(false);
  expect(FileTypeCheck.isStubFile('bob')).toBe(false);
});

it('INTERFACE return true', () => {
  expect(FileTypeCheck.isInterfaceFile('___interface.js.njk')).toBe(true);
});
it('INTERFACE return false', () => {
  expect(FileTypeCheck.isInterfaceFile('__interface.js.njk')).toBe(false);
  expect(FileTypeCheck.isInterfaceFile('___INTERFACE.js.njk')).toBe(false);
  expect(FileTypeCheck.isInterfaceFile('bob')).toBe(false);
});

it('EVAL return true and false tests', () => {
  expect(FileTypeCheck.isEvalFile('___eval.ts')).toBe(true);
  expect(FileTypeCheck.isEvalFile('something.___eval.ts')).toBe(false);
});

it('EXAMPLE return true and false tests', () => {
  expect(FileTypeCheck.isExampleFile('EXAMPLE_app.ts')).toBe(true);
  expect(FileTypeCheck.isExampleFile('EXAMPLEapp.ts')).toBe(false);
  expect(FileTypeCheck.isExampleFile('EXAMPLE.app.ts')).toBe(false);
});
