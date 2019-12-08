import generateOperationId from '@/lib/generate/generateOperationId';

it('handle a simple path', () => {
  expect(generateOperationId('get', 'some/path')).toBe('somePathGet');
});

it('handle a path with a path param', () => {
  expect(generateOperationId('get', 'some/{id}/path')).toBe('someIdPathGet');
});

it('handle a root', () => {
  expect(generateOperationId('get', '/')).toBe('get');
});
