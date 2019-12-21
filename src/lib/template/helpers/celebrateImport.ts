/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
import operationsPathsHasParamsToValidate from '@/lib/template/helpers/operationsPathsHasParamsToValidate';

/**
 * @deprecated WARNING this will be removed soon, please add this import into the templates directly.
 * @param operations
 */
export default (operations: any) => {
  return operationsPathsHasParamsToValidate(operations) ? 'import { celebrate } from \'celebrate\'' : '';
};
