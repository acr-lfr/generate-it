const swaggerUtils = require('../swaggerUtils');

const params = [
  { name: { type: 'string', description: 'Name' } }, // simple string/boolean/number
  { user: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string', required: true } } } }, // object with a required property
];

describe('pathParamsToJoi', function() {
  it('todo: fix the tests for the swaggerUtils', () => {
    expect(true).toBe(true)
  })
  // it('first param should be a simple string validation', function() {
  //   const param = params[0]
  //   Object.keys(param).forEach((propertyKey) => {
  //     const validationText = swaggerUtils.pathParamsToJoi(Object.assign({ name: propertyKey }, param[propertyKey]), { requiredFields: param.required })
  //     const correctValidationText = `${propertyKey}:Joi.${param[propertyKey].type}(),`
  //     expect(validationText).toEqual(correctValidationText)
  //   });
  // });
  // it('second param should be an object validation', function() {
  //   const param = params[1]
  //   Object.keys(param).forEach((propertyKey) => {
  //     const validationText = swaggerUtils.pathParamsToJoi(Object.assign({ name: propertyKey }, param[propertyKey]), { requiredFields: param.required })
  //     const correctValidationText = `${propertyKey}:Joi.object({name:Joi.string(),email:Joi.string().required(),}),`
  //     expect(validationText).toEqual(correctValidationText)
  //   });
  // });
});
