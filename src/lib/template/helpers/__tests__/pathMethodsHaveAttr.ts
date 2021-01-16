import pathMethodsHaveAttr from '@/lib/template/helpers/pathMethodsHaveAttr';
import { Operation } from '@/interfaces';

it('should return undefined', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      }
    }
  }];
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security')).toBe(true);
});

it('should return undefined', () => {
  const operations = [{
    path: {
      post: {
        'security': [{apiKey: ''}],
      }
    }
  }];
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security', 'jwtToken')).toBe(false);
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
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security', 'jwtToken')).toBe(true);
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
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security', 'jwtToken')).toBe(false);
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
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'security', 'jwtToken')).toBe(true);
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
  expect(pathMethodsHaveAttr(operations as unknown as Operation[], 'parameters', 'x-nested.required')).toBe(true);
});
