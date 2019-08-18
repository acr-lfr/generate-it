class OaToJsToJs {
  getType (leaf) {
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
  }

  arrayWalkWrite (input, string) {
    string = string || ' '
    for (let i = 0; i < input.length; ++i) {
      if (typeof input[i] === 'function') {
        string += this.getType(input[i]) + ', '
      } else if (Array.isArray(input[i])) {
        string += '[' + this.arrayWalkWrite(input[i]) + '],'
      } else if (typeof input[i] === 'object') {
        string += '{' + this.objectWalkWrite(input[i], string) + '}'
      }
    }
    return string.substring(0, string.length - 2)
  }

  objectWalkWrite (input, string) {
    string = string || '{'
    for (let key in input) {
      if (typeof input[key] === 'function') {
        string += key + ': ' + this.getType(input[key]) + `, `
      } else if (Array.isArray(input[key])) {
        string += key + ': [' + this.arrayWalkWrite(input[key]) + '],'
      } else if (typeof input[key] === 'object') {
        string += key + ': ' + this.objectWalkWrite(input[key])
      }
    }
    string += '},'
    return string
  }
}

module.exports = new OaToJsToJs()
