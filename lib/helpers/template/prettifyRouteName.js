const namingUtils = require('../NamingUtils')
module.exports = (value) => {
  return namingUtils.fixRouteName(value)
}
