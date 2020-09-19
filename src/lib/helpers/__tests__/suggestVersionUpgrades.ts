import { suggestVersionUpgrade, DependancyDiff } from '../suggestVersionUpgrade';

// https://semver.org/

describe('suggestVersionUpgrade', () => {
  let jsonDiff: DependancyDiff;

  it('should suggest upgrades', function () {
    jsonDiff = {
      '@test/missing': {
        'Changed To': '^1.19.0',
        'from': 'Not present on existing package.json, please add.',
      },
    };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBe('npm rm -rf @test/missing@1.19.0');

    jsonDiff = { '@test/samever2': { 'Changed To': '^3.1.4-beta', 'from': '1.0.89' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBe('npm rm -rf @test/samever2@3.1.4-beta');

    jsonDiff = { '@types/yamljs': { 'Changed To': '^0.2.31', 'from': '^0.2.30' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBe('npm rm -rf @types/yamljs@0.2.31');

    jsonDiff = { typescript: { 'Changed To': '^3.9.2', 'from': '^3.8.3' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBe('npm rm -rf typescript@3.9.2');
  });

  it('should not suggest downgrades or equivalent versions', () => {
    jsonDiff = { '@test/equal': { 'Changed To': '^5.0.0', 'from': '^5.0.0' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();

    jsonDiff = { '@test/also-equal': { 'Changed To': '^5.0.0', 'from': '~5.0.0' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();

    jsonDiff = { '@test/nearly-equal': { 'Changed To': '^5.0.0', 'from': '5.0.0' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();

    jsonDiff = { '@test/equal-nearly': { 'Changed To': '5.0.0', 'from': '^5.0.0' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();

    jsonDiff = { '@test/downgrade': { 'Changed To': '10', 'from': '600' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();

    jsonDiff = { '@test/samever': { 'Changed To': '^2.8.6-rc1', 'from': '2.8.6' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();

    jsonDiff = { '@test/random': { 'Changed To': '0.118.999-881.999.119.7253', 'from': '2.8.6' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();
  });

  it('should ignore gibberish', () => {
    jsonDiff = { '@types/hapi__joi': { 'Changed To': 'Removed', 'from': '1.0' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();

    jsonDiff = { jest: { 'Changed To': 'mocha', 'from': '25.2.1-bug-candidate' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();

    jsonDiff = { '@types/lodash': { 'Changed To': 'Not needed', 'from': 'Any version' } };
    expect(suggestVersionUpgrade(jsonDiff, 'npm rm -rf')).toBeUndefined();
  });

  it('can report all changes', async () => {
    jsonDiff = {
      '@test/missing': {
        'Changed To': '^1.19.0',
        'from': 'Not present on existing package.json, please add.',
      },
      '@test/samever2': { 'Changed To': '^3.1.4-beta', 'from': '1.0.89' },
      '@types/yamljs': { 'Changed To': '^0.2.31', 'from': '^0.2.30' },
      'typescript': { 'Changed To': '^3.9.2', 'from': '^3.8.3' },
      '@test/equal': { 'Changed To': '^5.0.0', 'from': '^5.0.0' },
      '@test/also-equal': { 'Changed To': '^5.0.0', 'from': '~5.0.0' },
      '@test/nearly-equal': { 'Changed To': '^5.0.0', 'from': '5.0.0' },
      '@test/equal-nearly': { 'Changed To': '5.0.0', 'from': '^5.0.0' },
      '@test/downgrade': { 'Changed To': '10', 'from': '600' },
      '@test/samever': { 'Changed To': '^2.8.6-rc1', 'from': '2.8.6' },
      '@test/random': { 'Changed To': '0.118.999-881.999.119.7253', 'from': '2.8.6' },
      '@types/hapi__joi': { 'Changed To': 'Removed', 'from': '1.0' },
      'jest': { 'Changed To': 'mocha', 'from': '25.2.1-bug-candidate' },
      '@types/lodash': { 'Changed To': 'Not needed', 'from': 'Any version' },
    };

    expect(suggestVersionUpgrade(jsonDiff, 'npm i -D')).toBe(
      'npm i -D @test/missing@1.19.0 @test/samever2@3.1.4-beta @types/yamljs@0.2.31 typescript@3.9.2'
    );
  });
});
