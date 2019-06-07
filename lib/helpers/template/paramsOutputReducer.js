const extractOASchemaPathResponses = require('../extractOASchemaPathResponses')
const oaToJs = require('../OaToJs')
const OaToJsToJs = require('../OaToJsToJs')

module.exports = (responses) => {
  const schema = extractOASchemaPathResponses(JSON.parse(JSON.stringify(responses)))
  let a = oaToJs.oaToJsType(schema)
  if (a && a.required) {
    delete a.required
  }
  if (Array.isArray(a)) {
    return '[' + OaToJsToJs.arrayWalkWrite(a) + '],'
  } else {
    return OaToJsToJs.objectWalkWrite(a)
  }
}
