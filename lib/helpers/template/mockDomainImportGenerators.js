const _ = require('lodash')
module.exports = (mockServer, operationName) => {
  return mockServer ? 'import ' + _.upperFirst(operationName) + 'DomainMock from \'./__mocks__/' + _.upperFirst(operationName) + 'DomainMock\'' : ''
}
