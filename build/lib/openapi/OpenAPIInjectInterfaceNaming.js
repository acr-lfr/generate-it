"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var generateOperationId_1 = tslib_1.__importDefault(require("../generate/generateOperationId"));
var openApiTypeToTypscriptType_1 = tslib_1.__importDefault(require("./openApiTypeToTypscriptType"));
var _ = tslib_1.__importStar(require("lodash"));
var ApiIs_1 = tslib_1.__importDefault(require("../helpers/ApiIs"));
var oa3toOa2Body_1 = tslib_1.__importDefault(require("./oa3toOa2Body"));
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
        if (this.isSwagger() || this.isOpenAPI3()) {
            return this.swaggerPathIterator(true);
        }
        throw new Error('Unrecognised input format');
    };
    /**
     * Merges the injected request params into single interface objects
     */
    OpenAPIInjectInterfaceNaming.prototype.mergeParameters = function () {
        if (this.isOpenAPI3()) {
            return this.swaggerPathIterator(false);
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
        return ApiIs_1["default"].swagger(this.apiObject);
    };
    /**
     * True is apiobject is openapi
     * @return {boolean}
     */
    OpenAPIInjectInterfaceNaming.prototype.isOpenAPI3 = function () {
        return ApiIs_1["default"].openapi3(this.apiObject);
    };
    /**
     * True is apiobject is openapi
     * @return {boolean}
     */
    OpenAPIInjectInterfaceNaming.prototype.isAsyncAPI2 = function () {
        return ApiIs_1["default"].asyncapi2(this.apiObject);
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
                    _this.xRequestInjector(path, method);
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
    OpenAPIInjectInterfaceNaming.prototype.xRequestInjector = function (path, method) {
        this.apiObject.paths[path][method]['x-request-definitions'] = this.injectFromAPIPaths(path, method);
        this.apiObject.paths[path][method]['x-response-definitions'] = this.injectFromSwaggerResponse(path, method);
    };
    /**
     * Calculates and injects the parameters into the main api object
     * @param path
     * @param method
     * @return {{headers: [], path: [], query: [], body: []}}
     */
    OpenAPIInjectInterfaceNaming.prototype.injectFromAPIPaths = function (path, method) {
        var _this = this;
        var requestParams = {
            body: {
                name: _.upperFirst(generateOperationId_1["default"](_.upperFirst(method), path)),
                params: []
            },
            formData: {
                name: _.upperFirst(generateOperationId_1["default"](_.upperFirst(method) + 'FormData', path)),
                params: []
            },
            header: {
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
        this.apiObject.paths[path][method] = oa3toOa2Body_1["default"](method, this.apiObject.paths[path][method]);
        if (this.apiObject.paths[path][method].parameters) {
            this.apiObject.paths[path][method].parameters.forEach(function (p) {
                if (p.$ref || (p.schema && p.schema.$ref)) {
                    var paramPath = _this.convertRefToOjectPath(p.$ref || p.schema.$ref);
                    var parameterObject = _.get(_this.apiObject, paramPath);
                    var paramType = parameterObject["in"] || p["in"];
                    try {
                        if (paramType === 'body') {
                            requestParams[paramType].params.push({
                                name: p.name,
                                path: paramPath
                            });
                        }
                        else {
                            requestParams[paramType].params.push(paramPath);
                        }
                    }
                    catch (e) {
                        console.error('There was an error parsing a path and its referenced definitions, please check it is correct within the provided API specfication file'.red.bold);
                        console.error('The path provided was: '.red + paramPath.red.bold);
                        console.error('This is typically a result of a definition not defined in the index.'.red);
                        console.error(parameterObject);
                        console.error(paramPath, parameterObject, 'The full API object:');
                        console.error(_this.apiObject);
                        throw e;
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
                    var name_1 = '\'' + parameterObject.name + '\'';
                    name_1 += (!parameterObject.required) ? '?' : '';
                    if (_this.isSwagger()) {
                        requestObject[name_1] = openApiTypeToTypscriptType_1["default"](parameterObject.type);
                    }
                    else if (_this.isOpenAPI3()) {
                        requestObject[name_1] = openApiTypeToTypscriptType_1["default"](parameterObject.schema.type);
                    }
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
        if (this.isOpenAPI3()) {
            return this.injectFromOA3Response(path, method);
        }
        if (this.isSwagger()) {
            return this.injectFromOA2Response(path, method);
        }
    };
    OpenAPIInjectInterfaceNaming.prototype.injectFromOA2Response = function (path, method) {
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
    OpenAPIInjectInterfaceNaming.prototype.injectFromOA3Response = function (path, method) {
        var response = {};
        var pathResponses = this.apiObject.paths[path][method].responses || false;
        if (pathResponses
            && pathResponses['200']
            && pathResponses['200'].content
            && pathResponses['200'].content['application/json']
            && pathResponses['200'].content['application/json'].schema
            && pathResponses['200'].content['application/json'].schema.$ref) {
            try {
                var responseInterface = this.convertRefToOjectPath(pathResponses['200'].content['application/json'].schema.$ref).split('.').pop();
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
