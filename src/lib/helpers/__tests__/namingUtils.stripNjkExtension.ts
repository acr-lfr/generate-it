import NamingUtils from '@/lib/helpers/NamingUtils';

const stripNjkExtension = NamingUtils.stripNjkExtension;

it('should return js from a simple test.js file name', () => {
  expect(stripNjkExtension('test.js.njk')).toBe('test.js');
});

it('should return js from a js.njk file name', () => {
  expect(stripNjkExtension('test.js.njk')).toBe('test.js');
});
