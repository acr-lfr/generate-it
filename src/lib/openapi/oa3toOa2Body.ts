import { startCase } from 'lodash';

export default (method: string, fullPathMethod: any): any => {
  if (
    !fullPathMethod.requestBody ||
    (Array.isArray(fullPathMethod.parameters) && fullPathMethod.parameters.some((param: any) => param.in === 'body'))
  ) {
    return fullPathMethod;
  }
  try {
    let schema = {};
    let inParam = 'body';

    if (fullPathMethod.requestBody.content['application/json']) {
      schema = fullPathMethod.requestBody.content['application/json'].schema;
    } else if (fullPathMethod.requestBody.content['application/x-www-form-urlencoded']) {
      schema = fullPathMethod.requestBody.content['application/x-www-form-urlencoded'].schema;
    } else if (fullPathMethod.requestBody.content['multipart/form-data']) {
      schema = fullPathMethod.requestBody.content['multipart/form-data'];
      inParam = 'formData';
    } else {
      schema = Object.values(fullPathMethod.requestBody.content)?.[0];
    }

    fullPathMethod.parameters = fullPathMethod.parameters || [];
    fullPathMethod.parameters.push({
      in: inParam,
      name: fullPathMethod.operationId + startCase(method),
      required: fullPathMethod.requestBody.required,
      schema,
    });

    return fullPathMethod;
  } catch (e) {
    console.log(fullPathMethod);
    console.error('Please pass body objects by reference to a component', e);
    throw e;
  }
};
