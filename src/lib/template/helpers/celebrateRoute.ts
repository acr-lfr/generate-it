import * as _ from 'lodash';
import pathsHasParamsToValidate from '@/lib/template/helpers/pathsHasParamsToValidate';

/**
 * @deprecated WARNING this will be removed, please add this to the templates directly.
 * @param operationName
 * @param parameters
 * @param operationId
 */
export default (operationName: string, parameters: any[], operationId: string) => {
  let celebrate = false;
  if (parameters) {
    celebrate = pathsHasParamsToValidate({
      parameters: parameters,
    });
  }
  return (celebrate) ? 'celebrate(' + _.camelCase(operationName) + 'Validators.' + operationId + '),' : '';
};
