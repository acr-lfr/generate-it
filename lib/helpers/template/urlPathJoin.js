const _ = require('lodash')
module.exports = function () {
  let returnString = ''
  for (let arg in arguments) {
    returnString += _.trim(arguments[arg], '/')
  }
  return returnString
}
