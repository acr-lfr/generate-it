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

const fullSwaggerObjectOA3: any = {
  components: {
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        name: 'api-key',
        in: 'header',
      },
      jwtToken: {
        type: 'http',
        scheme: 'bearer',
      },
      OAuth2: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://example.com/oauth/authorize',
            tokenUrl: 'https://example.com/oauth/token',
          },
        },
      },
    },
  },
};

it('should return empty string a path obj without security', () => {
  const pathObj: any = {};
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe('');
  expect(getSecurityNames(pathObj, fullSwaggerObjectOA3)).toBe('');
});

it('should return empty string for invalid security in path', () => {
  const pathObj: any = {
    security: [
      {
        bb: [],
      },
    ],
  };
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe('');
  expect(getSecurityNames(pathObj, fullSwaggerObjectOA3)).toBe('');
});

it('should return array', () => {
  const pathObj: any = {
    security: [
      {
        jwtToken: [],
      },
    ],
  };
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe(
    `['Authorization']`
  );
  expect(getSecurityNames(pathObj, fullSwaggerObjectOA3)).toBe(
    `['Authorization']`
  );
});

it('should return array with all values', () => {
  const pathObj: any = {
    security: [
      {
        jwtToken: [],
        apiKey: [],
      },
    ],
  };
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe(
    `['Authorization', 'api-key']`
  );
  expect(getSecurityNames(pathObj, fullSwaggerObjectOA3)).toBe(
    `['Authorization', 'api-key']`
  );
});

it('should return array with with authorization for type oauth2', () => {
  const pathObj: any = {
    security: [
      {
        OAuth2: [],
      },
    ],
  };
  expect(getSecurityNames(pathObj, fullSwaggerObjectOA3)).toBe(
    `['Authorization']`
  );
});

it('should return array with all values in alternate order', () => {
  const pathObj: any = {
    security: [
      {
        apiKey: [],
        jwtToken: [],
      },
    ],
  };
  expect(getSecurityNames(pathObj, fullSwaggerObject)).toBe(
    `['api-key', 'Authorization']`
  );
  expect(getSecurityNames(pathObj, fullSwaggerObjectOA3)).toBe(
    `['api-key', 'Authorization']`
  );
});
