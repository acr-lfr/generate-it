const _ = require('lodash')
module.exports = (mockServer, operationName, method) => {
  if (mockServer) {
    return 'return ' + _.upperFirst(operationName) + 'DomainMock.' + method + '()'
  } else {
    return 'return {}'
  }
}
