/**
 * This module is used to accommodate Swagger 2 data for easier rendering.
 * @module swagger2
 */

const _ = require('lodash');
const util = require('util')
const wrap = require('word-wrap');
const openAPIBundler = require('./openAPIBundler');
const generateOperationId = require('./generateOperationId')

/**
 * Accommodates Swagger object for easier rendering.
 *
 * @param  {String|Object} swagger File path to Swagger file or **fully bundled and dereferenced** Swagger JS object.
 * @return {Object}                The accommodated Swagger object.
 */
const openApiToObject = async swagger => {
  const authorized_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

  if (typeof swagger === 'string') {
    try {
      swagger = await openAPIBundler(swagger);
    } catch (e) {
      throw e;
    }
  } else if (typeof swagger !== 'object') {
    throw new Error(`Could not find a valid swagger definition: ${swagger}`);
  }

  swagger.basePath = swagger.basePath || '';

  _.each(swagger.paths, (path, path_name) => {
    path.endpointName = path_name === '/' ? 'root' : path_name.split('/')[1];
    _.each(path, (method, method_name) => {
      if (authorized_methods.indexOf(method_name.toUpperCase()) === -1) return;

      method.operationId = _.camelCase(method.operationId || generateOperationId(method_name, path_name).replace(/\s/g, '-'));
      method.descriptionLines = wrap(method.description || method.summary || '', { width: 60, indent: '' }).split(/\n/);
      _.each(method.parameters, param => {
        param.type = param.type || (param.schema ? param.schema.type : undefined);
      });
    });
  });

  swagger.endpoints = _.uniq(_.map(swagger.paths, 'endpointName'));
  console.log(util.inspect(swagger, false, null, true /* enable colors */))

  return swagger;
};

module.exports = openApiToObject;
