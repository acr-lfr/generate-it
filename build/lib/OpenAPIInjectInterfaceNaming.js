"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const generateOperationId_1 = tslib_1.__importDefault(require("./generateOperationId"));
const openApiTypeToTypscriptType_1 = tslib_1.__importDefault(require("./openApiTypeToTypscriptType"));
const _ = tslib_1.__importStar(require("lodash"));
class OpenAPIInjectInterfaceNaming {
    constructor(jsObject, passedConfig) {
        this.apiObject = jsObject;
        this.config = passedConfig;
    }
    /**
     * Merges the parameter namings into the path objects
     * @return {{paths}|module.exports.apiObject|{}}
     */
    inject() {
        if (this.isOpenAPI3()) {
            throw new Error('Currently openApi 3 is not supported');
        }
        if (this.isSwagger()) {
            return this.swaggerPathIterator(true);
        }
    }
    /**
     * Merges the injected request params into single interface objects
     */
    mergeParameters() {
        if (this.isOpenAPI3()) {
            throw new Error('Currently openApi 3 is not supported');
        }
        if (this.isSwagger()) {
            return this.swaggerPathIterator(false);
        }
    }
    /**
     * @param {string} ref
     * @return {string}
     */
    convertRefToOjectPath(ref) {
        const pathParts = [];
        ref.split('/').forEach((part) => {
            if (part !== '#') {
                pathParts.push(part);
            }
        });
        return pathParts.join('.');
    }
    /**
     * True is apiobject is swagger
     * @return {boolean}
     */
    isSwagger() {
        return !!(this.apiObject.swagger && this.apiObject.swagger === '2.0');
    }
    /**
     * True is apiobject is openapi
     * @return {boolean}
     */
    isOpenAPI3() {
        return !!(this.apiObject.openapi);
    }
    /**
     * Injects x-[request|response]-definitions into the main object
     * @return {{paths}|module.exports.apiObject|{paths}|{}}
     */
    swaggerPathIterator(fromInject) {
        if (!this.apiObject.paths) {
            throw new Error('No paths found to iterate over');
        }
        Object.keys(this.apiObject.paths).forEach((path) => {
            Object.keys(this.apiObject.paths[path]).forEach((method) => {
                if (fromInject) {
                    this.swaggerXInjector(path, method);
                }
                else {
                    this.mergeSwaggerInjectedParameters(path, method);
                }
            });
        });
        return this.apiObject;
    }
    /**
     * Injects param/definition paths
     * @param {string} path - Path of api
     * @param {string} method - Method of path to x inject to
     */
    swaggerXInjector(path, method) {
        this.apiObject.paths[path][method]['x-request-definitions'] = this.injectFromSwaggerpaths(path, method);
        this.apiObject.paths[path][method]['x-response-definitions'] = this.injectFromSwaggerResponse(path, method);
    }
    /**
     * Calculates and injects the parameters into the main api object
     * @param path
     * @param method
     * @return {{headers: [], path: [], query: [], body: []}}
     */
    injectFromSwaggerpaths(path, method) {
        const requestParams = {
            body: {
                name: _.upperFirst(generateOperationId_1.default(_.upperFirst(method) + 'Body', path)),
                params: [],
            },
            headers: {
                name: _.upperFirst(generateOperationId_1.default(_.upperFirst(method) + 'Headers', path)),
                params: [],
            },
            path: {
                name: _.upperFirst(generateOperationId_1.default(_.upperFirst(method) + 'Path', path)),
                params: [],
            },
            query: {
                name: _.upperFirst(generateOperationId_1.default(_.upperFirst(method) + 'Query', path)),
                params: [],
            },
        };
        if (this.apiObject.paths[path][method].parameters) {
            this.apiObject.paths[path][method].parameters.forEach((p) => {
                if (p.$ref || (p.schema && p.schema.$ref)) {
                    try {
                        const paramPath = this.convertRefToOjectPath(p.$ref || p.schema.$ref);
                        const parameterObject = _.get(this.apiObject, paramPath);
                        requestParams[parameterObject.in || p.in].params.push(paramPath);
                        if (p.schema) {
                            requestParams.body.interfaceName = paramPath.split('.').pop();
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            });
        }
        return requestParams;
    }
    /**
     * Inject the interfaces for query|path|header paramters and leave the path to the body definition
     * @param path
     * @param method
     */
    mergeSwaggerInjectedParameters(path, method) {
        Object.keys(this.apiObject.paths[path][method]['x-request-definitions']).forEach((requestType) => {
            const requestObject = {};
            let clear = true;
            this.apiObject.paths[path][method]['x-request-definitions'][requestType].params.forEach((requestPath) => {
                const parameterObject = _.get(this.apiObject, requestPath);
                clear = false;
                if (requestType === 'body') {
                    // make object from body
                }
                else {
                    let name = parameterObject.name;
                    name += (!parameterObject.required) ? '?' : '';
                    requestObject[name] = openApiTypeToTypscriptType_1.default(parameterObject.type);
                }
            });
            if (!clear) {
                this.apiObject.paths[path][method]['x-request-definitions'][requestType].interfaceText = this.objectToInterfaceString(requestObject);
            }
            else {
                delete this.apiObject.paths[path][method]['x-request-definitions'][requestType];
            }
        });
    }
    /**
     * Convert interface object to string
     * @param object
     * @return {string}
     */
    objectToInterfaceString(object) {
        let text = '';
        const delim = (this.config.interfaceStyle === 'interface') ? ',' : ';';
        Object.keys(object).forEach((key) => {
            text += key + ':' + object[key] + delim;
        });
        return text;
    }
    /**
     * Injects the request interface naming for the response objects
     * @param path
     * @param method
     * @return {{'200': null}}
     */
    injectFromSwaggerResponse(path, method) {
        const response = {};
        const pathResponses = this.apiObject.paths[path][method].responses || false;
        if (pathResponses && pathResponses['200'] && pathResponses['200'].schema && pathResponses['200'].schema.$ref) {
            try {
                const responseInterface = this.convertRefToOjectPath(pathResponses['200'].schema.$ref).split('.').pop();
                if (responseInterface) {
                    response['200'] = responseInterface;
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        return response;
    }
}
module.exports = OpenAPIInjectInterfaceNaming;
