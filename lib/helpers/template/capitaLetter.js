const namingUtils = require('../namingUtils')
module.exports = (str) => {
  return namingUtils.fixRouteName(str.charAt(0).toUpperCase() + str.substring(1))
}
