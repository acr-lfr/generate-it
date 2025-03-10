import SwaggerUtils from '../SwaggerUtils';
import { NodegenRc } from '@/interfaces';

const params = [
  {
    in: 'body',
    name: 'v1UserPasswordPut',
    required: true,
    schema: {
      type: 'object',
      required: ['password', 'newPassword'],
      properties: {
        password: {type: 'string'},
        newPassword: {type: 'string'},
        newPasswordConfirm: {type: 'string'},
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
  {
    in: 'body',
    name: 'v1UserPasswordAnyPut',
    required: true,
    schema: {
      type: 'object'
    },
  },
];

test('Returns joi with 2 required params', () => {
  expect(SwaggerUtils.createJoiValidation('post', {parameters: [params[0]]}, {} as NodegenRc)).toBe(
    `'body': Joi.object({'password':Joi.string().required(),'newPassword':Joi.string().required(),'newPasswordConfirm':Joi.string().allow('').allow(null),}),`
  );
});

test('openapi3 query request param', () => {
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [params[1]]}, {} as NodegenRc)).toBe(`'query': Joi.object({'limit':Joi.number().integer(),}),`);
});

test('openapi2 enums', () => {
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [params[3]]}, {} as NodegenRc)).toBe(
    `'query': Joi.object({'sort':Joi.string().allow('').valid('asc', 'desc'),}),`
  );
});

test('openapi3 enums', () => {
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [params[2]]}, {} as NodegenRc)).toBe(
    `'query': Joi.object({'sort':Joi.string().allow('').valid('asc', 'desc'),}),`
  );
});

test('openapi3 query request array param: allow single value', () => {
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [params[4]]}, {} as NodegenRc)).toBe(
    `'query': Joi.object({'select':Joi.array().items(Joi.string().allow('')).single(),}),`
  );
});

test('openapi3 request body: allow empty array', () => {
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [params[5]]}, {} as NodegenRc)).toBe(
    `'body': Joi.object({'selected':Joi.array().items(Joi.string().allow('').allow(null)).required(),}),`
  );
});

test('openapi3 request body empty object as any', () => {
  expect(SwaggerUtils.createJoiValidation('put', {parameters: [params[7]]}, {} as NodegenRc)).toBe(
    `'body': Joi.any(),`
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
    }, {} as NodegenRc)
  ).toBe(
    `'headers': Joi.object({'sort':Joi.string().valid('asc', 'desc').required(),'access':Joi.string().regex(/^Bearer .+$/).required(),}).unknown(true),'query': Joi.object({'limit':Joi.number().integer(),}),`
  );
});

test('query item key is properly created inside the query object', () => {
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [params[6]]}, {} as NodegenRc)).toBe(
    `'query': Joi.object({'objectInsideQuery': Joi.object({'prop1':Joi.string().allow(''),}),}),`
  );
});

test('enum values with string and number', () => {
  const param: Record<string, any> = {
    in: 'query',
    name: 'limit',
    schema: {type: 'number', default: 25, enum: [5, 25, 50]},
  };

  expect(SwaggerUtils.createJoiValidation('get', {parameters: [param]}, {} as NodegenRc))
    .toBe('\'query\': Joi.object({\'limit\':Joi.number().default(25).valid(5, 25, 50),}),');

  const paramsString: Record<string, any> = {
    in: 'query',
    name: 'limit',
    schema: {type: 'string', default: '25', enum: ['5', '25', '50']},
  };

  expect(SwaggerUtils.createJoiValidation('get', {parameters: [paramsString]}, {} as NodegenRc))
    .toBe('\'query\': Joi.object({\'limit\':Joi.string().allow(\'\').default(\'25\').valid(\'5\', \'25\', \'50\'),}),');
});

test('query numeric with min / max zero properly adds validation', () => {
  const param: Record<string, any> = {
    in: 'query',
    name: 'limit',
    required: false,
    schema: {type: 'number', minimum: 0},
    description: 'Max number of results returned',
    type: 'number',
    minimum: 0,
  };

  expect(SwaggerUtils.createJoiValidation('get', {parameters: [param]}, {} as NodegenRc)).toBe('\'query\': Joi.object({\'limit\':Joi.number().min(0),}),');

  param.type = 'integer';
  param.schema.type = 'integer';
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [param]}, {} as NodegenRc)).toBe('\'query\': Joi.object({\'limit\':Joi.number().integer().min(0),}),');

  param.type = 'number';
  param.schema.type = 'number';
  param.schema.maximum = 0;
  param.maximum = 0;
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [param]}, {} as NodegenRc)).toBe('\'query\': Joi.object({\'limit\':Joi.number().min(0).max(0),}),');

  param.type = 'integer';
  param.schema.type = 'integer';
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [param]}, {} as NodegenRc)).toBe(
    '\'query\': Joi.object({\'limit\':Joi.number().integer().min(0).max(0),}),'
  );
});

test('query string with min / max zero properly adds validation', () => {
  const param: Record<string, any> = {
    in: 'query',
    name: 'limit',
    required: false,
    schema: {type: 'string', minimum: 0},
    description: 'Max number of results returned',
    type: 'number',
    minimum: 0,
  };

  expect(SwaggerUtils.createJoiValidation('get', {parameters: [param]}, {} as NodegenRc)).toBe('\'query\': Joi.object({\'limit\':Joi.string().allow(\'\').min(0),}),');

  param.schema.maximum = 0;
  param.maximum = 0;
  expect(SwaggerUtils.createJoiValidation('get', {parameters: [param]}, {} as NodegenRc)).toBe(
    '\'query\': Joi.object({\'limit\':Joi.string().allow(\'\').min(0).max(0),}),'
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

  expect(SwaggerUtils.createJoiValidation('get', {parameters: [param]}, {} as NodegenRc)).toBe(
    `'body': Joi.object({'email':Joi.string().required(),'phoneNumber':Joi.string().allow('').allow(null).required(),'comment':Joi.string().allow('').allow(null).required(),'info':Joi.string().min(10).allow(null).required(),'code':Joi.number().allow(null).required(),}),`
  );
});

test('post object with nested objects that are required should be required in the joi validation output', () => {
  const pathObj: any = {
    'parameters': [
      {
        in: 'body',
        name: 'teamsPostPost',
        required: true,
        schema: {
          type: 'object',
          properties: {
            team: {
              type: 'object',
              required: ['name', 'isPremium'],
              properties: {
                name: {type: 'string', minLength: 1},
                isPremium: {type: 'boolean'},
              },
            },
            invitations: {
              type: 'array',
              items: {
                type: 'object',
                required: ['roleId'],
                properties: {
                  id: {type: 'number'},
                  name: {type: 'string'},
                  email: {type: 'string'},
                  roleId: {type: 'number'},
                  invitationLink: {type: 'string'},
                  action: {
                    type: 'string',
                    enum: ['create', 'update', 'delete'],
                  },
                },
              },
            },
            invitationsLanguage: {type: 'string'},
          },
        },
      },
    ]
  };

  const joiString = SwaggerUtils.createJoiValidation('post', pathObj, {} as NodegenRc);

  const expectedouput = `'body': Joi.object({'team':Joi.object({'name':Joi.string().min(1).required(),'isPremium':Joi.boolean().required(),}).allow(null),'invitations':Joi.array().items(Joi.object({'id':Joi.number().allow(null),'name':Joi.string().allow('').allow(null),'email':Joi.string().allow('').allow(null),'roleId':Joi.number().required(),'invitationLink':Joi.string().allow('').allow(null),'action':Joi.string().allow('').valid('create', 'update', 'delete').allow(null),}).allow(null)),'invitationsLanguage':Joi.string().allow('').allow(null),}),`;

  expect(joiString).toBe(expectedouput);
});

it('When the string attribute contains x-dont-trim then trim(true) should not be output', () => {
  const pathObj: any = {
    'parameters': [
      {
        in: 'body',
        name: 'teamsPostPost',
        required: true,
        schema: {
          type: 'object',
          properties: {
            team: {
              type: 'object',
              required: ['name'],
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                  'x-dont-trim': true
                },
              },
            }
          },
        },
      },
    ]
  };

  const joiString = SwaggerUtils.createJoiValidation('post', pathObj, {} as NodegenRc);

  const expectedouput = `'body': Joi.object({'team':Joi.object({'name':Joi.string().min(1).required(),}).allow(null),}),`;

  expect(joiString).toBe(expectedouput);
});

it('Default trim from nodegenrc always opt-out and off, and testing no nodegenrc object present at all', () => {
  const pathObj: any = {
    'parameters': [
      {
        in: 'body',
        name: 'teamsPostPost',
        required: true,
        schema: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    ]
  };

  expect(
    SwaggerUtils.createJoiValidation('post', pathObj)
  ).toBe(
    `'body': Joi.object({'name':Joi.string().required(),}),`
  );

  expect(
    SwaggerUtils.createJoiValidation('post', pathObj, {joi: {strings: {autoTrim: 'off'}}} as NodegenRc)
  ).toBe(
    `'body': Joi.object({'name':Joi.string().required(),}),`
  );

  expect(
    SwaggerUtils.createJoiValidation('post', pathObj, {joi: {strings: {autoTrim: 'opt-out'}}} as NodegenRc)
  ).toBe(
    `'body': Joi.object({'name':Joi.string().trim(true).required(),}),`
  );

  // add the don't trim to test the opt-out
  pathObj.parameters[0].schema.properties.name['x-dont-trim'] = true;

  expect(
    SwaggerUtils.createJoiValidation('post', pathObj, {joi: {strings: {autoTrim: 'opt-out'}}} as NodegenRc)
  ).toBe(
    `'body': Joi.object({'name':Joi.string().required(),}),`
  );
});

it('Adding the Joi methods to the string', () => {
  const pathObj: any = {
    'parameters': [
      {
        in: 'body',
        name: 'teamsPostPost',
        required: true,
        schema: {
          type: 'object',
          properties: {
            team: {
              type: 'object',
              required: ['name'],
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                  // tslint:disable-next-line
                  'x-joi-lowercase': null,
                  'x-joi-email': {
                    allowFullyQualified: true
                  },
                },
              },
            }
          },
        },
      },
    ]
  };

  const joiString = SwaggerUtils.createJoiValidation('post', pathObj, {} as NodegenRc);

  const expectedouput = `'body': Joi.object({'team':Joi.object({'name':Joi.string().lowercase().email({"allowFullyQualified":true}).min(1).required(),}).allow(null),}),`;

  expect(joiString).toBe(expectedouput);
});
