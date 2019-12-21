/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
import pathsHasParamsToValidate from '@/lib/template/helpers/pathsHasParamsToValidate';

export default (operations: any) => {
  let hasParamsToValidate = false;
  if (operations) {
    operations.forEach((operation: any) => {
      Object.keys(operation.path).forEach((pathVerb) => {
        if (pathsHasParamsToValidate(operation.path[pathVerb])) {
          hasParamsToValidate = true;
        }
      });
    });
  }
  return hasParamsToValidate;
};
