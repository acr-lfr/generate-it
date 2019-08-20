const validMethod = require('./validMethod')
module.exports = (operations) => {
  let imports = []
  Object.keys(operations).forEach((operationKey) => {
    const operation = operations[operationKey]
    Object.keys(operation.path).forEach((pathKey) => {
      const path = operation.path[pathKey]
      if (validMethod(pathKey)) {
        // Inject the request parameter interfaces
        ['query', 'path', 'body', 'headers', 'formData'].forEach((requestType) =>{
          if (path['x-request-definitions'][requestType]) {
            if (path['x-request-definitions'][requestType].interfaceName) {
              if (imports.indexOf(path['x-request-definitions'][requestType].interfaceName) === -1) {
                imports.push(path['x-request-definitions'][requestType].interfaceName)
              }
            }
            if (path['x-request-definitions'][requestType].name) {
              if (imports.indexOf(path['x-request-definitions'][requestType].name) === -1) {
                imports.push(path['x-request-definitions'][requestType].name)
              }
            }
          }
        })
        // Inject the response interfaces
        if (path['x-response-definitions']) {
          for (let statusCode in path['x-response-definitions']) {
            if (imports.indexOf(path['x-response-definitions'][statusCode]) === -1) {
              imports.push(path['x-response-definitions'][statusCode])
            }
          }
        }
      }
    })
  })
  imports.sort()
  return imports
}