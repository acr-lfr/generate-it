const DataTransform = require('node-json-transform').DataTransform;

/**
 *
 * @param {object}   keyValuePairs The key:value pair mappings, eg {"name": "user.fullname", "age": "age"}
 * @param {array}    data the data object to transform
 * @param {array}    operators (optional) See https://www.npmjs.com/package/node-json-transform#basic-example
 * @param {function} transformerFunction
 * @returns {*}
 */
export default (keyValuePairs: object, data: any = [], operators: any = [], transformerFunction = (item: any) => { return item }) => {
  if (!Array.isArray(data)) {
    data = [data];
  }
  const dataMapped = {
    data,
  };
  const map = {
    list: 'data',
    item: keyValuePairs,
    operate: operators,
    each: transformerFunction,
  };

  return (DataTransform(dataMapped, map)).transform();
}
