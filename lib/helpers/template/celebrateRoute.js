const camelCase = require('./camelCase')
/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
module.exports = (operationName, parameters, operationId) => {
  let celebrate = false
  if(parameters){
    parameters.forEach((param) => {
      if(['path', 'query', 'body'].indexOf(param.in) !== -1){
        celebrate = true
      }
    })
  }
  return (celebrate) ? 'celebrate(' + camelCase(operationName) + 'Validators.' + operationId + '),': ''
}
