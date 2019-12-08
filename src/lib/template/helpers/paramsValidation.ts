import SwaggerUtils from '@/lib/helpers/SwaggerUtils';

export default (params: any) => {
  return SwaggerUtils.createJoiValidation(params);
};
