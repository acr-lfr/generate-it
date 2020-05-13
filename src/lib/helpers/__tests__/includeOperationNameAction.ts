import includeOperationNameAction from '@/lib/helpers/includeOperationNameAction';

it('should return false', function () {
  expect(includeOperationNameAction(
    'ms-images', {
      publish: {},
      subscribe: {}
    },
    {
      nodegenDir: 'generated',
      nodegenMockDir: '/__mocks__',
      nodegenType: 'server',
      helpers: {
        operationNames: {}
      }
    })).toEqual(false);
});
it('should return a pathProp without the subscribe', function () {
  expect(includeOperationNameAction(
    'ms-images', {
      publish: {},
      subscribe: {}
    }, {
      nodegenDir: 'generated',
      nodegenMockDir: '/__mocks__',
      nodegenType: 'server',
      helpers: {
        operationNames: {
          includePublish: ['ms-images']
        }
      }
    })).toEqual({
    publish: {}
  });
});
it('should return a pathProp without the publish', function () {
  expect(includeOperationNameAction(
    'ms-images', {
      publish: {},
      subscribe: {}
    }, {
      nodegenDir: 'generated',
      nodegenMockDir: '/__mocks__',
      nodegenType: 'server',
      helpers: {
        operationNames: {
          includeSubscribe: ['ms-images']
        }
      }
    })).toEqual({
    subscribe: {}
  });
});
it('should return false', function () {
  expect(includeOperationNameAction(
    'ms-images', {
      publish: {},
      subscribe: {}
    }, {
      nodegenDir: 'generated',
      nodegenMockDir: '/__mocks__',
      nodegenType: 'server',
      helpers: {
        operationNames: {
          includePublish: ['ms-auth']
        }
      }
    })).toBe(false);
});
