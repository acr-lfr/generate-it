import SwaggerUtils from '@/lib/helpers/SwaggerUtils';

export default function (method: string, pathMethodObject: any) {
  return SwaggerUtils.createJoiValidation(
    method,
    pathMethodObject,
    this.ctx.nodegenRc
  );
}
