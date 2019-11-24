const camelCaseStringReplacement = require('../camelCaseStringReplacement');

describe('Single replacer entries', () => {
  it('Should split spaces to return helloWorldHowAreYou', () => {
    expect(camelCaseStringReplacement('Hello world how are you', ' ')).toBe('helloWorldHowAreYou');
  });

  it('Should split dots to return wwwAcrontumDe', () => {
    expect(camelCaseStringReplacement('www.acrontum.de', '.')).toBe('wwwAcrontumDe');
  });

  it('Should split dots to return wwwAcrontumDe with double entries', () => {
    expect(camelCaseStringReplacement('www.acrontum..de', '.')).toBe('wwwAcrontumDe');
  });

  it('Should split dots to return wwwAcrontumDe with tripple entries', () => {
    expect(camelCaseStringReplacement('.www..acrontum...de', '.')).toBe('wwwAcrontumDe');
  });
});

describe('Array of replacer values', () => {
  it('Replace dots, slashes and colon', () => {
    expect(camelCaseStringReplacement('https://www.acrontum.de', ['.', '/', ':'])).toBe('httpsWwwAcrontumDe');
  });

  it('Replace dots, slashes and colon with double and tripple entries', () => {
    expect(camelCaseStringReplacement('https:://www.acrontum..de', ['.', '/', ':'])).toBe('httpsWwwAcrontumDe');
  });
});
