import includeOperationName from '../includeOperationName';

describe('includeOperationName', () => {
  it('should return true', function () {
    expect(includeOperationName('ms-auth', {
      'nodegenDir': 'generated',
      'nodegenMockDir': '/__mocks__',
      'nodegenType': 'server',
      'helpers': {
        'operationNames': {
          'include': ['ms-auth']
        }
      }
    })).toBe(true);
  });

  it('should return false', function () {
    expect(includeOperationName('ms-images', {
      'nodegenDir': 'generated',
      'nodegenMockDir': '/__mocks__',
      'nodegenType': 'server',
      'helpers': {
        'operationNames': {
          'include': ['ms-auth']
        }
      }
    })).toBe(false);
  });

  it('should return false', function () {
    expect(includeOperationName('ms-images', {
      'nodegenDir': 'generated',
      'nodegenMockDir': '/__mocks__',
      'nodegenType': 'server',
      'helpers': {
        'operationNames': {
          'exclude': ['ms-auth']
        }
      }
    })).toBe(true);
  });

  it('should return false', function () {
    expect(includeOperationName('ms-images', {
      'nodegenDir': 'generated',
      'nodegenMockDir': '/__mocks__',
      'nodegenType': 'server',
      'helpers': {
        'operationNames': {
          'exclude': ['ms-images']
        }
      }
    })).toBe(false);
  });

  it('should return false', function () {
    expect(includeOperationName('ms-images', {
      'nodegenDir': 'generated',
      'nodegenMockDir': '/__mocks__',
      'nodegenType': 'server',
      'helpers': {
        'operationNames': {}
      }
    })).toBe(false);
  });

  it('should return false', function () {
    expect(includeOperationName('ms-images', {
      'nodegenDir': 'generated',
      'nodegenMockDir': '/__mocks__',
      'nodegenType': 'server'
    })).toBe(true);
  });
});
