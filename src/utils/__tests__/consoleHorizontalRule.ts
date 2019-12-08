import consoleHorizontalRule from '@/utils/consoleHorizontalRule';

it('should return the correct qty of dashes', () => {
  const actual = process.stdout.columns;
  process.stdout.columns = 15;
  expect(consoleHorizontalRule().length).toBe(15);
  process.stdout.columns = actual;
});
