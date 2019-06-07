const _ = require('lodash');

/**
 * Generates an "operationId" attribute based on path and method names.
 *
 * @private
 * @param  {String} method_name HTTP method name.
 * @param  {String} path_name   Path name.
 * @return {String}
 */
module.exports = (method_name, path_name) => {
  if (path_name === '/') return method_name;

  // clean url path for requests ending with '/'
  let clean_path = path_name;
  if (clean_path.indexOf('/', clean_path.length - 1) !== -1) {
    clean_path = clean_path.substring(0, clean_path.length - 1);
  }

  let segments = clean_path.split('/').slice(1);
  segments = _.transform(segments, (result, segment) => {
    if (segment[0] === '{' && segment[segment.length - 1] === '}') {
      segment = `by-${_.capitalize(segment.substring(1, segment.length - 1))}}`;
    }
    result.push(segment);
  });

  return _.camelCase(`${method_name.toLowerCase()}-${segments.join('-')}`);
};
