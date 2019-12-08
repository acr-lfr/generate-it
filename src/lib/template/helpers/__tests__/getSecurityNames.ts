import getSecurityNames from '@/lib/template/helpers/getSecurityNames';

const fullSwaggerObject: any = {
  securityDefinitions: {
    apiKey: {
      type: 'apiKey',
      name: 'api-key',
      in: 'header',
    },
    jwtToken: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
};

it('should return empty string a path obj without security', () => {
  const pathObj: any = {};
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe('');
});

it('should return empty string for invalid security in path', () => {
  const pathObj: any = {
    security: [{
      bb: [],
    }],
  };
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe('');
});

it('should return array', () => {
  const pathObj: any = {
    security: [{
      jwtToken: [],
    }],
  };
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe(`['Authorization']`);
});

it('should return array with all values', () => {
  const pathObj: any = {
    security: [{
      jwtToken: [],
      apiKey: [],
    }],
  };
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe(`['Authorization', 'api-key']`);
});

it('should return array with all values in alternate order', () => {
  const pathObj: any = {
    security: [{
      apiKey: [],
      jwtToken: [],
    }],
  };
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe(`['api-key', 'Authorization']`);
});
