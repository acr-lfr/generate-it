import { startCase } from 'lodash';

export default (method: string, fullPathMethod: any): any => {
  if (!fullPathMethod.requestBody) {
    return fullPathMethod;
  }
  try {
    const schema = fullPathMethod.requestBody.content['application/json'].schema;
    fullPathMethod.parameters = fullPathMethod.parameters || [];
    fullPathMethod.parameters.push({
      in: 'body',
      name: fullPathMethod.operationId + startCase(method),
      required: fullPathMethod.requestBody.required,
      schema: schema
    });
    return fullPathMethod;
  } catch (e) {
    console.error('Please pass body objects by reference to a component', e);
    throw e;
  }
};
