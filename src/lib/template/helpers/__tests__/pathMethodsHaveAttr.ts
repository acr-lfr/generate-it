import pathMethodsHaveAttr from '@/lib/template/helpers/pathMethodsHaveAttr';

it('should return undefined', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      }
    }
  }];
  expect(pathMethodsHaveAttr(operations, 'security')).toBe(true);
});

it('should return undefined', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      }
    }
  }];
  expect(pathMethodsHaveAttr(operations, 'security', 'jwtToken')).toBe(false);
});

it('should return true', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      },
      put: {
        'security': [{jwtToken: ''}],
      }
    },
  }];
  expect(pathMethodsHaveAttr(operations, 'security', 'jwtToken')).toBe(true);
});

it('should return false', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      }
    },
  }, {
    path: {
      patch: {
        'security': [{apiKey: ''}],
      }
    },
  }];
  expect(pathMethodsHaveAttr(operations, 'security', 'jwtToken')).toBe(false);
});

it('should return true', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      }
    },
  }, {
    path: {
      post: {
        'security': [{jwtToken: ''}],
      }
    },
  }];
  expect(pathMethodsHaveAttr(operations, 'security', 'jwtToken')).toBe(true);
});

it('should return true', () => {
  const operations = [{
    path: {
      post: {
        parameters: [{
          'x-nested': {
            required: true
          }
        }]
      }
    },
  }];
  expect(pathMethodsHaveAttr(operations, 'parameters', 'x-nested.required')).toBe(true);
});
