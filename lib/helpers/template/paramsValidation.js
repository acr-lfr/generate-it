const swaggerUtils = require('../SwaggerUtils')
module.exports = (params) => {
  return swaggerUtils.createJoiValidation(params)
}
