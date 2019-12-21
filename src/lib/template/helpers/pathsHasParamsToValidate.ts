/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
export default (pathObject: any) => {
  let hasParamsToValidate = false;
  if (pathObject.parameters) {
    pathObject.parameters.forEach((param: any) => {
      if (['path', 'query', 'body'].indexOf(param.in) !== -1) {
        hasParamsToValidate = true;
      }
    });
  }
  return hasParamsToValidate;
};
