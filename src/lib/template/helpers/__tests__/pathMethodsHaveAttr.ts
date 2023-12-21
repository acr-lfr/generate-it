import pathMethodsHaveAttr from '@/lib/template/helpers/pathMethodsHaveAttr';
import { Operation } from '@/interfaces';

it('should return true for a known attribute security provided', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      }
    }
  }];
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security')).toBe(true);
});

it('should return true for an attribute not in th path object', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      }
    }
  }];
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'alien')).toBe(false);
});

it('should return true for a path attr and a nested path, security and jwtToken', () => {
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
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security', 'jwtToken')).toBe(true);
});

it('should return false for a known attr, security, and an known nested path jwtToken', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      }
    }
  }];
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security', 'jwtToken')).toBe(false);
});

it('should return false for multiple paths, known attributes and no known nested path', () => {
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
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security', 'jwtToken')).toBe(false);
});

it('should return true for many paths of known attrs security and known nested path', () => {
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
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security', 'jwtToken')).toBe(true);
});

it('should return true for a deeply nested path x-nested.required', () => {
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
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'parameters', 'x-nested.required')).toBe(true);
});

it('should return true for a path attr and an array of nested paths', () => {
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
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security', ['JwtToken', 'jwtToken'])).toBe(true);
});
