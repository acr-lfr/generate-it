const oaToJs = require('../OaToJs')
const OaToJsToJs = require('../OaToJsToJs')
const oa2OrOa3 = (param) => {
  if (param.type) {
    let assign = {}
    assign[param.name] = {
      type: param.type
    }
    return assign
  } else {
    return param.schema
  }
}
module.exports = (parameters) => {
  let body = {}
  let query = {}
  let params = {}
  if (parameters) {
    parameters = JSON.parse(JSON.stringify(parameters))
    parameters.forEach((param) => {
      if (param.in === 'body') {
        body = Object.assign(body, param.schema.properties)
      }
      if (param.in === 'query') {
        query = Object.assign(query, oa2OrOa3(param))
      }
      if (param.in === 'path') {
        params = Object.assign(params, oa2OrOa3(param))
      }
    })
    oaToJs.objectWalk(body)
    oaToJs.objectWalk(query)
    oaToJs.objectWalk(params)
    return OaToJsToJs.objectWalkWrite({
      body: body, query: query, params: params
    })
  }
  return `{
    body: {},
    query: {},
    params: {},
  },
`
}
