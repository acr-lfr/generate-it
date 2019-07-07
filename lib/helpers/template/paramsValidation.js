const swaggerUtils = require('../swaggerUtils')
module.exports = (params) => {
  return swaggerUtils.createJoiValidation(params)
}
