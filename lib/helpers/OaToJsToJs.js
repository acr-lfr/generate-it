const writeToJs = {
  getType: (leaf) => {
    if (leaf === Object) {
      return 'Object'
    } else if (leaf === Array) {
      return 'Array'
    } else if (leaf === String) {
      return 'String'
    } else if (leaf === Number) {
      return 'Number'
    } else if (leaf === Boolean) {
      return 'Boolean'
    }
  },
  arrayWalkWrite: (input, string) => {
    string = string || ' '
    for (let i = 0; i < input.length; ++i) {
      if (typeof input[i] === 'function') {
        string += writeToJs.getType(input[i]) + ', '
      } else if (Array.isArray(input[i])) {
        string += '[' + writeToJs.arrayWalkWrite(input[i]) + '],'
      } else if (typeof input[i] === 'object') {
        string += '{' + writeToJs.objectWalkWrite(input[i], string) + '}'
      }
    }
    return string.substring(0, string.length - 2)
  },
  objectWalkWrite: (input, string) => {
    string = string || '{'
    for (let key in input) {
      if (typeof input[key] === 'function') {

        string += key + ': ' + writeToJs.getType(input[key]) + `, `

      } else if (Array.isArray(input[key])) {

        string += key + ': [' + writeToJs.arrayWalkWrite(input[key]) + '],'

      } else if (typeof input[key] === 'object') {

        string += key + ': ' + writeToJs.objectWalkWrite(input[key])

      }
    }
    string += '},'
    return string
  },
}

module.exports = writeToJs
