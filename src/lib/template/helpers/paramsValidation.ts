import SwaggerUtils from '@/lib/helpers/SwaggerUtils';

export default (method: string, pathMethodObject: any) => {
  return SwaggerUtils.createJoiValidation(method, pathMethodObject);
};
