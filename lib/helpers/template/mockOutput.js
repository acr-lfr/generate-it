const extractOASchemaPathResponses = require('../extractOASchemaPathResponses')
const dummyGenerate = (schema) => {
  return schema ? 'return mockItGenerator(' + JSON.stringify(schema) + ')' : null
}

module.exports = (path, mockServer) => {
  if (mockServer) {
    return (path && path.responses) ?
      dummyGenerate(extractOASchemaPathResponses(path.responses)) :
      null
  } else {
    return 'return {}'
  }
}
