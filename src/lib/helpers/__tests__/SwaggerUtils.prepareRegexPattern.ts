import SwaggerUtils from '@/lib/helpers/SwaggerUtils';

it('should return as-is', async () => {
  const input = '/^[A-Za-zÀ-ž\d-_]{1,}(?:[A-Za-zÀ-ž\d-_]{1,}\s){0,}[A-Za-zÀ-ž\d-_]{1,}$/';
  expect(SwaggerUtils.prepareRegexPattern(input)).toBe(input);
});

it('should return with leading slash', async () => {
  const input = '^[A-Za-zÀ-ž\d-_]{1,}(?:[A-Za-zÀ-ž\d-_]{1,}\s){0,}[A-Za-zÀ-ž\d-_]{1,}$/';
  expect(SwaggerUtils.prepareRegexPattern(input)).toBe('/' + input);
});

it('should return with trailing slash', async () => {
  const input = '/^[A-Za-zÀ-ž\d-_]{1,}(?:[A-Za-zÀ-ž\d-_]{1,}\s){0,}[A-Za-zÀ-ž\d-_]{1,}$';
  expect(SwaggerUtils.prepareRegexPattern(input)).toBe(input + '/');
});

it('should return with leading and trailing slash', async () => {
  const input = '^[A-Za-zÀ-ž\d-_]{1,}(?:[A-Za-zÀ-ž\d-_]{1,}\s){0,}[A-Za-zÀ-ž\d-_]{1,}$';
  expect(SwaggerUtils.prepareRegexPattern(input)).toBe('/' + input + '/');
});

it('should return with with leading slash for patterns with regex options variations at the end but input has no leading slash', async () => {
  const input = '^[A-Za-zÀ-ž\d-_]{1,}(?:[A-Za-zÀ-ž\d-_]{1,}\s){0,}[A-Za-zÀ-ž\d-_]{1,}$';
  const gmusi = 'gmusi';
  for (let i = 0; i < gmusi.length; ++i) {
    let testInput = input + `/${gmusi[i]}`;
    expect(
      SwaggerUtils.prepareRegexPattern(testInput)
    ).toBe('/' + testInput);
  }
  let testInput = input + `/${gmusi}`
  expect(
    SwaggerUtils.prepareRegexPattern(testInput)
  ).toBe('/' + testInput);
});

it('should return with as-is for patterns with regex options variations at the end', async () => {
  const input = '/^[A-Za-zÀ-ž\d-_]{1,}(?:[A-Za-zÀ-ž\d-_]{1,}\s){0,}[A-Za-zÀ-ž\d-_]{1,}$';
  const gmusi = 'gmusi';
  for (let i = 0; i < gmusi.length; ++i) {
    let testInput = input + `/${gmusi[i]}`;
    expect(
      SwaggerUtils.prepareRegexPattern(testInput)
    ).toBe(testInput);
  }
  let testInput = input + `/${gmusi}`
  expect(
    SwaggerUtils.prepareRegexPattern(testInput)
  ).toBe(testInput);
});
