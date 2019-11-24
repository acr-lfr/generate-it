"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const generateOperationFile_1 = tslib_1.__importDefault(require("./generateOperationFile"));
const _ = tslib_1.__importStar(require("lodash"));
/**
 * Generates all the files for each operation by iterating over the operations.
 *
 * @param   {Object}  config Configuration options
 * @returns {Promise}
 */
exports.default = (config) => new Promise((resolve, reject) => {
    const files = {};
    _.each(config.data.swagger.paths, (operationPath, pathName) => {
        let operationName;
        const segments = pathName.split('/').filter((s) => s && s.trim() !== '');
        let joinedSegments;
        if (segments.length > config.segmentsCount) {
            segments.splice(config.segmentsCount);
            operationName = segments.join(' ').toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            joinedSegments = segments.join('/');
        }
        else {
            operationName = operationPath.endpointName;
            joinedSegments = operationName;
        }
        if (files[operationName] === undefined) {
            files[operationName] = [];
        }
        pathName = pathName.replace(/}/g, '').replace(/{/g, ':');
        files[operationName].push({
            path_name: pathName,
            path: operationPath,
            subresource: (pathName.substring(joinedSegments.length + 1) || '/').replace(/}/g, '').replace(/{/g, ':'),
        });
        Promise.all(_.map(files, (operation, operationNameItem) => {
            return generateOperationFile_1.default(config, operation, operationNameItem);
        })).then(() => {
            resolve(files);
        }).catch(reject);
    });
});
