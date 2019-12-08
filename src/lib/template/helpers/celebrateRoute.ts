import * as _ from 'lodash';

/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
export default (operationName: string, parameters: any[], operationId: string) => {
  let celebrate = false;
  if (parameters) {
    parameters.forEach((param) => {
      if (['path', 'query', 'body'].indexOf(param.in) !== -1) {
        celebrate = true;
      }
    });
  }
  return (celebrate) ? 'celebrate(' + _.camelCase(operationName) + 'Validators.' + operationId + '),' : '';
};
