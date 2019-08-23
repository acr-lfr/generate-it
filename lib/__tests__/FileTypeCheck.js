const FileTypeCheck = require('../FileTypeCheck')

it('OP return true', async () => {
  expect(FileTypeCheck.isOpertationFile('___op.js.njk')).toBe(true)
})
it('OP return false', async () => {
  expect(FileTypeCheck.isOpertationFile('__op.js.njk')).toBe(false)
  expect(FileTypeCheck.isOpertationFile('___OP.js.njk')).toBe(false)
  expect(FileTypeCheck.isOpertationFile('bob')).toBe(false)
})

it('MOCK return true', async () => {
  expect(FileTypeCheck.isMockFile('___mock.js.njk')).toBe(true)
})
it('MOCK return false', async () => {
  expect(FileTypeCheck.isMockFile('__mock.js.njk')).toBe(false)
  expect(FileTypeCheck.isMockFile('___MOCK.js.njk')).toBe(false)
  expect(FileTypeCheck.isMockFile('bob')).toBe(false)
})

it('STUB return true', async () => {
  expect(FileTypeCheck.isStubFile('___stub.js.njk')).toBe(true)
})
it('STUB return false', async () => {
  expect(FileTypeCheck.isStubFile('__stub.js.njk')).toBe(false)
  expect(FileTypeCheck.isStubFile('___STUB.js.njk')).toBe(false)
  expect(FileTypeCheck.isStubFile('bob')).toBe(false)
})

it('INTERFACE return true', async () => {
  expect(FileTypeCheck.isInterfaceFile('___interface.js.njk')).toBe(true)
})
it('INTERFACE return false', async () => {
  expect(FileTypeCheck.isInterfaceFile('__interface.js.njk')).toBe(false)
  expect(FileTypeCheck.isInterfaceFile('___INTERFACE.js.njk')).toBe(false)
  expect(FileTypeCheck.isInterfaceFile('bob')).toBe(false)
})
