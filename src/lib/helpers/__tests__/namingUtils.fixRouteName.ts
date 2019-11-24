const fixRouteName = require('../NamingUtils').fixRouteName;

it('Return as is if provided argument does not contain -', () => {
  expect(fixRouteName('helloworld')).toBe('helloworld');
});

it('Return camelcase from snake case', () => {
  expect(fixRouteName('hello-world')).toBe('helloWorld');
});

it('Return camelcase from multi snake case', () => {
  expect(fixRouteName('hello-world-today-now')).toBe('helloWorldTodayNow');
});
