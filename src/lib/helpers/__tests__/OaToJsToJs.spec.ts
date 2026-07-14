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

it('should build a string from an array of mixed values without duplicating the prefix', async () => {
  expect(OaToJsToJs.arrayWalkWrite([Number, String])).toBe(' Number, String');
  expect(OaToJsToJs.arrayWalkWrite([Number, {id: Number}])).toBe(' Number, {id: Number, }');
  expect(OaToJsToJs.arrayWalkWrite([[Number], String])).toBe(' [ Number], String');
});

it('should build a string from an object containing an array of objects', async () => {
  const input = {
    list: [{id: Number}],
    next: String,
  };
  expect(OaToJsToJs.objectWalkWrite(input)).toBe('{list: [ {id: Number, }],next: String, },');
});
