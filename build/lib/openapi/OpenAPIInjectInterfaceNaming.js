"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var generateOperationId_1 = tslib_1.__importDefault(require("../generate/generateOperationId"));
var openApiTypeToTypscriptType_1 = tslib_1.__importDefault(require("./openApiTypeToTypscriptType"));
var _ = tslib_1.__importStar(require("lodash"));
var OpenAPIInjectInterfaceNaming = /** @class */ (function () {
    function OpenAPIInjectInterfaceNaming(jsObject, passedConfig) {
        this.apiObject = jsObject;
        this.config = passedConfig || {};
    }
    /**
     * Merges the parameter namings into the path objects
     * @return {{paths}|module.exports.apiObject|{}}
     */
    OpenAPIInjectInterfaceNaming.prototype.inject = function () {
        if (this.isOpenAPI3()) {
            throw new Error('Currently openApi 3 is not supported');
        }
        if (this.isSwagger()) {
            return this.swaggerPathIterator(true);
        }
    };
    /**
     * Merges the injected request params into single interface objects
     */
    OpenAPIInjectInterfaceNaming.prototype.mergeParameters = function () {
        if (this.isOpenAPI3()) {
            throw new Error('Currently openApi 3 is not supported');
        }
        if (this.isSwagger()) {
            return this.swaggerPathIterator(false);
        }
    };
    /**
     * @param {string} ref
     * @return {string}
     */
    OpenAPIInjectInterfaceNaming.prototype.convertRefToOjectPath = function (ref) {
        var pathParts = [];
        ref.split('/').forEach(function (part) {
            if (part !== '#') {
                pathParts.push(part);
            }
        });
        return pathParts.join('.');
    };
    /**
     * True is apiobject is swagger
     * @return {boolean}
     */
    OpenAPIInjectInterfaceNaming.prototype.isSwagger = function () {
        return !!(this.apiObject.swagger && this.apiObject.swagger === '2.0');
    };
    /**
     * True is apiobject is openapi
     * @return {boolean}
     */
    OpenAPIInjectInterfaceNaming.prototype.isOpenAPI3 = function () {
        return !!(this.apiObject.openapi);
    };
    /**
     * Injects x-[request|response]-definitions into the main object
     * @return {{paths}|module.exports.apiObject|{paths}|{}}
     */
    OpenAPIInjectInterfaceNaming.prototype.swaggerPathIterator = function (fromInject) {
        var _this = this;
        if (!this.apiObject.paths) {
            throw new Error('No paths found to iterate over');
        }
        Object.keys(this.apiObject.paths).forEach(function (path) {
            Object.keys(_this.apiObject.paths[path]).forEach(function (method) {
                if (fromInject) {
                    _this.swaggerXInjector(path, method);
                }
                else {
                    _this.mergeSwaggerInjectedParameters(path, method);
                }
            });
        });
        return this.apiObject;
    };
    /**
     * Injects param/definition paths
     * @param {string} path - Path of api
     * @param {string} method - Method of path to x inject to
     */
    OpenAPIInjectInterfaceNaming.prototype.swaggerXInjector = function (path, method) {
        this.apiObject.paths[path][method]['x-request-definitions'] = this.injectFromSwaggerpaths(path, method);
        this.apiObject.paths[path][method]['x-response-definitions'] = this.injectFromSwaggerResponse(path, method);
    };
    /**
     * Calculates and injects the parameters into the main api object
     * @param path
     * @param method
     * @return {{headers: [], path: [], query: [], body: []}}
     */
    OpenAPIInjectInterfaceNaming.prototype.injectFromSwaggerpaths = function (path, method) {
        var _this = this;
        var requestParams = {
            body: {
                name: _.upperFirst(generateOperationId_1["default"](_.upperFirst(method) + 'Body', path)),
                params: []
            },
            headers: {
                name: _.upperFirst(generateOperationId_1["default"](_.upperFirst(method) + 'Headers', path)),
                params: []
            },
            path: {
                name: _.upperFirst(generateOperationId_1["default"](_.upperFirst(method) + 'Path', path)),
                params: []
            },
            query: {
                name: _.upperFirst(generateOperationId_1["default"](_.upperFirst(method) + 'Query', path)),
                params: []
            }
        };
        if (this.apiObject.paths[path][method].parameters) {
            this.apiObject.paths[path][method].parameters.forEach(function (p) {
                if (p.$ref || (p.schema && p.schema.$ref)) {
                    try {
                        var paramPath = _this.convertRefToOjectPath(p.$ref || p.schema.$ref);
                        var parameterObject = _.get(_this.apiObject, paramPath);
                        requestParams[parameterObject["in"] || p["in"]].params.push(paramPath);
                        // if (p.schema) {
                        //   const name = paramPath.split('.').pop();
                        //   requestParams.body.interfaceName = name;
                        //   requestParams.body.name = name;
                        // }
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            });
        }
        return requestParams;
    };
    /**
     * Inject the interfaces for query|path|header paramters and leave the path to the body definition
     * @param path
     * @param method
     */
    OpenAPIInjectInterfaceNaming.prototype.mergeSwaggerInjectedParameters = function (path, method) {
        var _this = this;
        Object.keys(this.apiObject.paths[path][method]['x-request-definitions']).forEach(function (requestType) {
            var requestObject = {};
            var clear = true;
            _this.apiObject.paths[path][method]['x-request-definitions'][requestType].params.forEach(function (requestPath) {
                var parameterObject = _.get(_this.apiObject, requestPath);
                clear = false;
                if (requestType === 'body') {
                    // make object from body
                }
                else {
                    var name_1 = parameterObject.name;
                    name_1 += (!parameterObject.required) ? '?' : '';
                    requestObject[name_1] = openApiTypeToTypscriptType_1["default"](parameterObject.type);
                }
            });
            if (!clear) {
                var name_2 = _this.apiObject.paths[path][method]['x-request-definitions'][requestType].name;
                _this.apiObject.paths[path][method]['x-request-definitions'][requestType].interfaceText = {
                    outputString: _this.objectToInterfaceString(requestObject, name_2)
                };
            }
            else {
                delete _this.apiObject.paths[path][method]['x-request-definitions'][requestType];
            }
        });
    };
    /**
     * Convert interface object to string
     * @param object
     * @param name
     * @return {string}
     */
    OpenAPIInjectInterfaceNaming.prototype.objectToInterfaceString = function (object, name) {
        var text = "export interface " + name + " {\n  ";
        var delim = (this.config.interfaceStyle === 'interface') ? ',' : ';';
        Object.keys(object).forEach(function (key) {
            text += key + ':' + object[key] + delim;
        });
        return text + '  \n } ';
    };
    /**
     * Injects the request interface naming for the response objects
     * @param path
     * @param method
     * @return {{'200': null}}
     */
    OpenAPIInjectInterfaceNaming.prototype.injectFromSwaggerResponse = function (path, method) {
        var response = {};
        var pathResponses = this.apiObject.paths[path][method].responses || false;
        if (pathResponses && pathResponses['200'] && pathResponses['200'].schema && pathResponses['200'].schema.$ref) {
            try {
                var responseInterface = this.convertRefToOjectPath(pathResponses['200'].schema.$ref).split('.').pop();
                if (responseInterface) {
                    response['200'] = responseInterface;
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        return response;
    };
    return OpenAPIInjectInterfaceNaming;
}());
exports["default"] = OpenAPIInjectInterfaceNaming;
