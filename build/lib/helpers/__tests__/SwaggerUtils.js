"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const SwaggerUtils_1 = tslib_1.__importDefault(require("../SwaggerUtils"));
const params = [{
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
    }];
test('Returns joi with 2 required params', () => {
    expect(SwaggerUtils_1.default.createJoiValidation([params[0]])).toBe('body: {password:Joi.string().allow(\'\').required(),newPassword:Joi.string().allow(\'\').required(),newPasswordConfirm:Joi.string().allow(\'\'),},');
});
test('openapi3 query request param', () => {
    expect(SwaggerUtils_1.default.createJoiValidation([params[1]])).toBe('query: {limit:Joi.number().integer(),},');
});
test('openapi2 enums', () => {
    expect(SwaggerUtils_1.default.createJoiValidation([params[3]])).toBe('query: {sort:Joi.string().allow(\'\').valid([\'asc\', \'desc\']),},');
});
test('openapi3 enums', () => {
    expect(SwaggerUtils_1.default.createJoiValidation([params[2]])).toBe('query: {sort:Joi.string().allow(\'\').valid([\'asc\', \'desc\']),},');
});
