import { startCase } from 'lodash';

export default (method: string, fullPathMethod: any): any => {
  if (
    !fullPathMethod.requestBody ||
    (Array.isArray(fullPathMethod.parameters) && fullPathMethod.parameters.some((param: any) => param.in === 'body'))
  ) {
    return fullPathMethod;
  }
  try {
    let schema;
    if (fullPathMethod.requestBody.content['application/json']) {
      schema = fullPathMethod.requestBody.content['application/json'].schema;
    }
    if (fullPathMethod.requestBody.content['application/x-www-form-urlencoded']) {
      schema = fullPathMethod.requestBody.content['application/x-www-form-urlencoded'].schema;
    }
    fullPathMethod.parameters = fullPathMethod.parameters || [];
    fullPathMethod.parameters.push({
      in: 'body',
      name: fullPathMethod.operationId + startCase(method),
      required: fullPathMethod.requestBody.required,
      schema: schema,
    });
    return fullPathMethod;
  } catch (e) {
    console.log(fullPathMethod);
    console.error('Please pass body objects by reference to a component', e);
    throw e;
  }
};
