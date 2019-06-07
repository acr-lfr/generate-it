const DataTransform = require('node-json-transform').DataTransform

/**
 *
 * @param {object}   keyValuePairs The key:value pair mappings, eg {"name": "user.fullname", "age": "age"}
 * @param {array}    data the data object to transform
 * @param {string}   type The type of response
 * @param {array}    operators (optional) See https://www.npmjs.com/package/node-json-transform#basic-example
 * @param {function} transformerFunction
 * @returns {*}
 */
export default async (keyValuePairs, data = [], type = 'object', operators = [], transformerFunction = (item) => { return item }) => {
  if (!Array.isArray(data)) {
    data = [data]
  }

  const resp = await DataTransform({
    data,
  }, {
    list: 'data',
    item: keyValuePairs,
    operate: operators,
    each: transformerFunction,
  }).transformAsync()
  return (type === 'array') ? resp : resp[0]
}
