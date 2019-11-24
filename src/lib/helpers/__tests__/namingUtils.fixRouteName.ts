import NamingUtils from '@/lib/helpers/NamingUtils';

it('Return as is if provided argument does not contain -', () => {
  expect(NamingUtils.fixRouteName('helloworld')).toBe('helloworld');
});

it('Return camelcase from snake case', () => {
  expect(NamingUtils.fixRouteName('hello-world')).toBe('helloWorld');
});

it('Return camelcase from multi snake case', () => {
  expect(NamingUtils.fixRouteName('hello-world-today-now')).toBe('helloWorldTodayNow');
});
