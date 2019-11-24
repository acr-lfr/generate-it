"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const word_wrap_1 = tslib_1.__importDefault(require("word-wrap"));
const ValidHttpMethods_1 = tslib_1.__importDefault(require("../constants/ValidHttpMethods"));
const generateOperationId_1 = tslib_1.__importDefault(require("./generateOperationId"));
const OpenAPIBundler_1 = tslib_1.__importDefault(require("./OpenAPIBundler"));
class OpenApiToObject {
    /**
     * @param  {Object} config File path to Swagger file or **fully bundled and dereferenced** Swagger JS object.
     */
    constructor(config) {
        this.apiFile = config.swaggerFilePath;
        this.config = config;
    }
    async build() {
        if (typeof this.apiFile === 'string') {
            return this.iterateObject(await OpenAPIBundler_1.default.bundle(this.apiFile, this.config));
        }
        else if (typeof this.apiFile !== 'object') {
            throw new Error(`Could not find a valid swagger definition: ${this.apiFile}`);
        }
        else {
            return this.iterateObject(this.apiFile);
        }
    }
    iterateObject(apiObject) {
        apiObject.basePath = apiObject.basePath || '';
        _.each(apiObject.paths, (path, pathName) => {
            path.endpointName = pathName === '/' ? 'root' : pathName.split('/')[1];
            _.each(path, (method, methodName) => {
                if (ValidHttpMethods_1.default.indexOf(methodName.toUpperCase()) === -1) {
                    return;
                }
                method.operationId = _.camelCase(method.operationId || generateOperationId_1.default(methodName, pathName).replace(/\s/g, '-'));
                method.descriptionLines = word_wrap_1.default(method.description || method.summary || '', {
                    width: 60, indent: '',
                }).split(/\n/);
                _.each(method.parameters, (param) => {
                    param.type = param.type || (param.schema ? param.schema.type : undefined);
                });
            });
        });
        apiObject.endpoints = _.uniq(_.map(apiObject.paths, 'endpointName'));
        return apiObject;
    }
}
exports.default = OpenApiToObject;
//# sourceMappingURL=OpenApiToObject.js.map