const _ = require('lodash')
const ucFirst = require('./ucFirst')
const SHOULD_PLURAL = [] //['Routes', 'TransformInputs', 'TransformOutputs', 'Validators']
const FUNCS_DIRS = ['routes', 'transformInputs', 'transformOutputs', 'validators']

class NamingUtils {
  generateOperationSuffix (subdir, operation, ext) {
    const subDirParts = subdir.split('/')
    const subDirLastSegment = subDirParts[subDirParts.length - 1]
    let suffix = subDirLastSegment
    if (suffix.indexOf('__') !== -1) {
      // remove the __ and grab the next path segment
      let start = subDirParts[subDirParts.length - 2]
      start = start.substring(0, start.length - 1)
      suffix = start + _.upperFirst(suffix.split('__').join(''))
    }
    suffix = ucFirst(suffix)
    if (SHOULD_PLURAL.includes(suffix)) {
      suffix += 's'
    }
    if (!FUNCS_DIRS.includes(subDirLastSegment)) {
      operation = operation.charAt(0).toUpperCase() + operation.substring(1)
    }

    return operation + suffix + '.' + ext
  }

  fixRouteName (value) {
    const index = value.indexOf('-')
    if (index !== -1) {
      const charAfter = value.charAt(index + 1).toUpperCase()
      value = value.substring(0, index) + charAfter + value.substring(index + 2)
      return this.fixRouteName(value)
    } else {
      return value
    }
  }

  stripNjkExtension (input) {
    if (input.substring(input.length - 4) === '.njk') {
      return input.substring(0, input.length - 4)
    } else {
      return input
    }
  }

  getFileExt (filename) {
    let parts = filename.split('.')
    return (parts[parts.length - 1] !== 'njk') ? parts[parts.length - 1] : parts[parts.length - 2]
  }
}

module.exports = new NamingUtils()
