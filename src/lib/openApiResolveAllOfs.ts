const jsonSchemaResolveAllOf = require('json-schema-resolve-allof');

export default (input: any) => {
  return jsonSchemaResolveAllOf(input)
}
