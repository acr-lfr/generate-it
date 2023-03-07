import OaToJsToJs from '@/lib/helpers/OaToJsToJs';

it('shouldWrapAttribute should return correct values', async () => {
  expect(OaToJsToJs.shouldWrapAttribute('hello')).toBe(false);
  expect(OaToJsToJs.shouldWrapAttribute('hello_world')).toBe(false);
  expect(OaToJsToJs.shouldWrapAttribute('hello world')).toBe(true);
  expect(OaToJsToJs.shouldWrapAttribute('hello-world')).toBe(true);
});

it('should build a string from an object correctly', async () => {
  const input = {
    hi: String,
    mid_way: {
      wheel: String
    },
    'end of the line': Number
  };
  expect(OaToJsToJs.objectWalkWrite(input)).toBe('{hi: String, mid_way: {wheel: String, },[\'end of the line\']: Number, },');
});
