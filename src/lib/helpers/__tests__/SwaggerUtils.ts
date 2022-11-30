import SwaggerUtils from '../SwaggerUtils';

const params = [
  {
    in: 'body',
    name: 'v1UserPasswordPut',
    required: true,
    schema: {
      type: 'object',
      required: ['password', 'newPassword'],
      properties: {
        password: { type: 'string' },
        newPassword: { type: 'string' },
        newPasswordConfirm: { type: 'string' },
      },
    },
  },
  {
    name: 'limit',
    in: 'query',
    description: 'How many items to return at one time (max 100)',
    required: false,
    schema: {
      type: 'integer',
      format: 'int32',
    },
  },
  {
    name: 'sort',
    in: 'query',
    description: 'Sort direction, asc or desc',
    required: false,
    schema: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
  },
  {
    name: 'sort',
    in: 'query',
    description: 'Sort direction, asc or desc',
    required: false,
    type: 'string',
    enum: ['asc', 'desc'],
  },
  {
    in: 'query',
    name: 'select',
    description: 'Selected fields',
    type: 'array',
    items: {
      type: 'string',
    },
    required: false,
  },
  {
    in: 'body',
    name: 'v1UserPasswordPut',
    required: true,
    schema: {
      type: 'object',
      required: ['selected'],
      properties: {
        selected: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  },
  {
    in: 'query',
    name: 'objectInsideQuery',
    schema: {
      type: 'object',
      properties: [
        {
          name: 'prop1',
          type: 'string',
        },
      ],
    },
  },
];

test('Returns joi with 2 required params', () => {
  expect(SwaggerUtils.createJoiValidation('post', { parameters: [params[0]] })).toBe(
    `'body': Joi.object({'password':Joi.string().required(),'newPassword':Joi.string().required(),'newPasswordConfirm':Joi.string().allow('').allow(null),}),`
  );
});

test('openapi3 query request param', () => {
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [params[1]] })).toBe(`'query': Joi.object({'limit':Joi.number().integer(),}),`);
});

test('openapi2 enums', () => {
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [params[3]] })).toBe(
    `'query': Joi.object({'sort':Joi.string().allow('').valid('asc', 'desc'),}),`
  );
});

test('openapi3 enums', () => {
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [params[2]] })).toBe(
    `'query': Joi.object({'sort':Joi.string().allow('').valid('asc', 'desc'),}),`
  );
});

test('openapi3 query request array param: allow single value', () => {
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [params[4]] })).toBe(
    `'query': Joi.object({'select':Joi.array().items(Joi.string().allow('')).single(),}),`
  );
});

test('openapi3 request body: allow empty array', () => {
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [params[5]] })).toBe(
    `'body': Joi.object({'selected':Joi.array().items(Joi.string().allow('').allow(null)).required(),}),`
  );
});

test('add unknown true for headers', () => {
  expect(
    SwaggerUtils.createJoiValidation('get', {
      parameters: [
        {
          name: 'sort',
          in: 'header',
          required: true,
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
          },
        },
        {
          name: 'access',
          in: 'header',
          required: true,
          schema: {
            type: 'string',
            pattern: '^Bearer .+$',
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'How many items to return at one time (max 100)',
          required: false,
          schema: {
            type: 'integer',
            format: 'int32',
          },
        },
      ],
    })
  ).toBe(
    `'headers': Joi.object({'sort':Joi.string().valid('asc', 'desc').required(),'access':Joi.string().regex(/^Bearer .+$/).required(),}).unknown(true),'query': Joi.object({'limit':Joi.number().integer(),}),`
  );
});

test('query item key is properly created inside the query object', () => {
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [params[6]] })).toBe(
    `'query': Joi.object({'objectInsideQuery': Joi.object({'prop1':Joi.string().allow(''),}),}),`
  );
});

test('query numeric with min / max zero properly adds validation', () => {
  const param: Record<string, any> = {
    in: 'query',
    name: 'limit',
    required: false,
    schema: { type: 'number', minimum: 0 },
    description: 'Max number of results returned',
    type: 'number',
    minimum: 0,
  };

  expect(SwaggerUtils.createJoiValidation('get', { parameters: [param] })).toBe("'query': Joi.object({'limit':Joi.number().min(0),}),");

  param.type = 'integer';
  param.schema.type = 'integer';
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [param] })).toBe("'query': Joi.object({'limit':Joi.number().integer().min(0),}),");

  param.type = 'number';
  param.schema.type = 'number';
  param.schema.maximum = 0;
  param.maximum = 0;
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [param] })).toBe("'query': Joi.object({'limit':Joi.number().min(0).max(0),}),");

  param.type = 'integer';
  param.schema.type = 'integer';
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [param] })).toBe(
    "'query': Joi.object({'limit':Joi.number().integer().min(0).max(0),}),"
  );
});

test('query string with min / max zero properly adds validation', () => {
  const param: Record<string, any> = {
    in: 'query',
    name: 'limit',
    required: false,
    schema: { type: 'string', minimum: 0 },
    description: 'Max number of results returned',
    type: 'number',
    minimum: 0,
  };

  expect(SwaggerUtils.createJoiValidation('get', { parameters: [param] })).toBe("'query': Joi.object({'limit':Joi.string().allow('').min(0),}),");

  param.schema.maximum = 0;
  param.maximum = 0;
  expect(SwaggerUtils.createJoiValidation('get', { parameters: [param] })).toBe(
    "'query': Joi.object({'limit':Joi.string().allow('').min(0).max(0),}),"
  );
});

test('respects x-nullable and nullable for required body parameters', () => {
  const param = {
    in: 'body',
    name: 'userPut',
    required: true,
    schema: {
      type: 'object',
      required: [
        'email',
        'phoneNumber',
        'comment',
        'info',
        'code'
      ],
      properties: {
        email: {
          type: 'string'
        },
        phoneNumber: {
          type: 'string',
          nullable: true
        },
        comment: {
          type: 'string',
          'x-nullable': true,
        },
        info: {
          type: 'string',
          nullable: true,
          minLength: 10
        },
        code: {
          type: 'number',
          nullable: true
        }
      },
    },
  };

  expect(SwaggerUtils.createJoiValidation('get', { parameters: [param] })).toBe(
    `'body': Joi.object({'email':Joi.string().required(),'phoneNumber':Joi.string().allow('').allow(null).required(),'comment':Joi.string().allow('').allow(null).required(),'info':Joi.string().min(10).allow(null).required(),'code':Joi.number().allow(null).required(),}),`
  );
});
