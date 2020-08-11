import SwaggerUtils from '../SwaggerUtils';

const params = [{
  in: 'body',
  name: 'v1UserPasswordPut',
  required: true,
  schema:
    {
      type: 'object',
      required: ['password', 'newPassword'],
      properties:
        {
          password: {type: 'string'},
          newPassword: {type: 'string'},
          newPasswordConfirm: {type: 'string'},
        },
    },
}, {
  name: 'limit',
  in: 'query',
  description: 'How many items to return at one time (max 100)',
  required: false,
  schema: {
    type: 'integer',
    format: 'int32',
  },
}, {
  name: 'sort',
  in: 'query',
  description: 'Sort direction, asc or desc',
  required: false,
  schema: {
    type: 'string',
    enum: [
      'asc',
      'desc',
    ],
  },
}, {
  name: 'sort',
  in: 'query',
  description: 'Sort direction, asc or desc',
  required: false,
  type: 'string',
  enum: [
    'asc',
    'desc',
  ],
}, {
  in: 'query',
  name: 'select',
  description: 'Selected fields',
  type: 'array',
  items: {
    type: 'string'
  },
  required: false,
}, {
  in: 'body',
  name: 'v1UserPasswordPut',
  required: true,
  schema:
    {
      type: 'object',
      required: ['selected'],
      properties:
        {
          selected: {
            type: 'array',
            items: {
              type: 'string'
            },
          },
        },
    },
}];

test('Returns joi with 2 required params', () => {
  expect(
    SwaggerUtils.createJoiValidation('post', {parameters: [params[0]]}),
  ).toBe(
    `'body': {'password':Joi.string().required(),'newPassword':Joi.string().required(),'newPasswordConfirm':Joi.string().allow(''),},`,
  );
});

test('openapi3 query request param', () => {
  expect(
    SwaggerUtils.createJoiValidation('get', {parameters: [params[1]]}),
  ).toBe(
    `'query': {'limit':Joi.number().integer(),},`,
  );
});

test('openapi2 enums', () => {
  expect(
    SwaggerUtils.createJoiValidation('get', {parameters: [params[3]]}),
  ).toBe(
    `'query': {'sort':Joi.string().allow('').valid('asc', 'desc'),},`,
  );
});

test('openapi3 enums', () => {
  expect(
    SwaggerUtils.createJoiValidation('get', {parameters: [params[2]]}),
  ).toBe(
    `'query': {'sort':Joi.string().allow('').valid('asc', 'desc'),},`,
  );
});

test('openapi3 query request array param: allow single value', () => {
  expect(
    SwaggerUtils.createJoiValidation('get', {parameters: [params[4]]}),
  ).toBe(
    `'query': {'select':Joi.array().items(Joi.string().allow('')).single(),},`,
  );
});

test('openapi3 request body: allow empty array', () => {
  expect(
    SwaggerUtils.createJoiValidation('get', {parameters: [params[5]]}),
  ).toBe(
    `'body': {'selected':Joi.array().items(Joi.string().allow('')).required(),},`,
  );
});

test('add unknown true for headers', () => {
  expect(
    SwaggerUtils.createJoiValidation('get', {
      parameters: [{
        name: 'sort',
        in: 'header',
        required: true,
        schema: {
          type: 'string',
          enum: [
            'asc',
            'desc',
          ],
        },
      }, {
        name: 'access',
        in: 'header',
        required: true,
        schema: {
          type: 'string',
          pattern: '^Bearer .+$',
        },
      }, {
        name: 'limit',
        in: 'query',
        description: 'How many items to return at one time (max 100)',
        required: false,
        schema: {
          type: 'integer',
          format: 'int32',
        },
      }]
    }),
  ).toBe(
    `'headers': {'sort':Joi.string().valid('asc', 'desc').required(),'access':Joi.string().regex(/^Bearer .+$/).required(),}.unknown(true),'query': {'limit':Joi.number().integer(),},`,
  );
});
