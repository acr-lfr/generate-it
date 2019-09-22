const _ = require('lodash')
module.exports = function (inputString, trimChars) {
  return _.trimEnd(inputString, trimChars)
}
