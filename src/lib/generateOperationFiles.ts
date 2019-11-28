import GenerateOperationFileConfig from '@/interfaces/GenerateOperationFileConfig';
import generateOperationFile from '@/lib/generateOperationFile';
import * as _ from 'lodash';

/**
 * Generates all the files for each operation by iterating over the operations.
 *
 * @param   {Object}  config Configuration options
 * @returns {Promise}
 */
export default (config: GenerateOperationFileConfig) => new Promise((resolve, reject) => {
  const files: any = {};
  // Iterate over all path
  // pathProperties = all the http verbs and their contents
  // pathName = the full path after the basepath
  _.each(config.data.swagger.paths, (pathProperties, pathName) => {
    let operationName;
    const segments = pathName.split('/').filter((s) => s && s.trim() !== '');
    let joinedSegments;
    // if (segments.length > config.segmentsCount) {
      // segments.splice(config.segmentsCount);
      // operationName = segments.join(' ').toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
      // joinedSegments = segments.join('/');
    // } else {
      operationName = pathProperties.endpointName;
      joinedSegments = operationName;
    // }

    if (files[operationName] === undefined) {
      files[operationName] = [];
    }

    pathName = pathName.replace(/}/g, '').replace(/{/g, ':');
    files[operationName].push({
      path_name: pathName,
      path: pathProperties,
      subresource: (pathName.substring(joinedSegments.length + 1) || '/').replace(/}/g, '').replace(/{/g, ':'),
    });
  });
  Promise.all(
    _.map(files, (operation, operationNameItem) => {
      return generateOperationFile(config, operation, operationNameItem);
    }),
  ).then(() => {
    resolve(files);
  }).catch(reject);
});
