const oaToJs = {
  oaToJsType: (input, from) => {
    if (!input.type && input.properties) {
      input.type = 'object'
    }
    switch (input['type']) {
      case 'string':
        if (input['format']) {
          if (input['format'] === 'date-time') {
            return Object
          }
        }
        return String
      case 'integer':
        return Number
      case 'number':
        return Number
      case 'boolean':
        return Boolean
      case 'array':
        if (!input['items']) {
          return Array
        } else {
          return [oaToJs.oaToJsType(input['items'])]
        }
      case 'object':
        if (!input['properties']) {
          return Object
        } else {
          return oaToJs.objectWalk(input['properties'], from)
        }
    }
  },
  objectWalk: (input) => {
    for (let key in input) {
      if (input[key]['type']) {
        input[key] = oaToJs.oaToJsType(input[key], key)
      } else if (typeof input[key] !== 'function') {
        delete input[key]
      }
    }
    return input
  }
}
module.exports = oaToJs
