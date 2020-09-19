import { semverCompare } from '../semverCompare';

// https://semver.org/

describe('semverCompare', () => {
  it('should be able to sort semver arrays', function () {
    let sorted: string[];

    sorted = ['1', '2'].sort(semverCompare);
    expect(sorted).toEqual(['1', '2']);

    sorted = ['2', '1'].sort(semverCompare);
    expect(sorted).toEqual(['1', '2']);

    sorted = ['1.0', '2.0'].sort(semverCompare);
    expect(sorted).toEqual(['1.0', '2.0']);

    sorted = ['2.0', '1.0'].sort(semverCompare);
    expect(sorted).toEqual(['1.0', '2.0']);

    sorted = ['1.0.0', '2.0'].sort(semverCompare);
    expect(sorted).toEqual(['1.0.0', '2.0']);

    sorted = ['1.0', '2.0.0'].sort(semverCompare);
    expect(sorted).toEqual(['1.0', '2.0.0']);

    sorted = ['1.0.3', '2.0.4'].sort(semverCompare);
    expect(sorted).toEqual(['1.0.3', '2.0.4']);

    sorted = ['1.1.0', '1-alpha'].sort(semverCompare);
    expect(sorted).toEqual(['1-alpha', '1.1.0']);

    sorted = ['1.0.0-alpha.beta', '1.0.0-alpha.alpha'].sort(semverCompare);
    expect(sorted).toEqual(['1.0.0-alpha.alpha', '1.0.0-alpha.beta']);

    sorted = ['1-alpha.beta', '1-alpha.alpha'].sort(semverCompare);
    expect(sorted).toEqual(['1-alpha.alpha', '1-alpha.beta']);

    sorted = ['1.0.0-alpha', '1.0.0'].sort(semverCompare);
    expect(sorted).toEqual(['1.0.0-alpha', '1.0.0']);

    sorted = ['1.0.0-alpha', '1.0.0-beta'].sort(semverCompare);
    expect(sorted).toEqual(['1.0.0-alpha', '1.0.0-beta']);

    sorted = ['2.0.0-alpha', '1.0.0-beta'].sort(semverCompare);
    expect(sorted).toEqual(['1.0.0-beta', '2.0.0-alpha']);

    sorted = ['16.0.0', '20.0.0'].sort(semverCompare);
    expect(sorted).toEqual(['16.0.0', '20.0.0']);

    sorted = ['1.0.0+20130313144700', '1.0.0-alpha+001', '1.0.0-beta+exp.sha.5114f85'].sort(semverCompare);
    expect(sorted).toEqual(['1.0.0-alpha+001', '1.0.0-beta+exp.sha.5114f85', '1.0.0+20130313144700']);

    sorted = [
      '1.0.0',
      '1.0.0-alpha.beta',
      '1.0.0-beta',
      '1.0.0-beta.2',
      '1.0.0-rc.1',
      '1.0.0-alpha',
      '1.0.0-beta.11',
      '1.0.0-alpha.1',
    ].sort(semverCompare);
    expect(sorted).toEqual([
      '1.0.0-alpha',
      '1.0.0-alpha.1',
      '1.0.0-alpha.beta',
      '1.0.0-beta',
      '1.0.0-beta.2',
      '1.0.0-beta.11',
      '1.0.0-rc.1',
      '1.0.0',
    ]);
  });
});
