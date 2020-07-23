import { startCase } from 'lodash';
import validMethods from '@/lib/template/helpers/validMethods';

export default (method: string, fullPathMethod: any): any => {
  if (!fullPathMethod.requestBody || (Array.isArray(fullPathMethod.parameters) && fullPathMethod.parameters.some((param: any) => param.in === 'body'))) {
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
    const addMethodToName = !validMethods().map(m => m.toLowerCase()).some(m => fullPathMethod.operationId.toLowerCase().endsWith(m))
    fullPathMethod.parameters.push({
      in: 'body',
      name: fullPathMethod.operationId + (addMethodToName ? startCase(method) : ''),
      required: fullPathMethod.requestBody.required,
      schema: schema
    });
    return fullPathMethod;
  } catch (e) {
    console.log(fullPathMethod);
    console.error('Please pass body objects by reference to a component', e);
    throw e;
  }
};
