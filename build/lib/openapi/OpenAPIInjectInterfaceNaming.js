"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var generateOperationId_1 = tslib_1.__importDefault(require("../generate/generateOperationId"));
var _ = tslib_1.__importStar(require("lodash"));
var ApiIs_1 = tslib_1.__importDefault(require("../helpers/ApiIs"));
var oa3toOa2Body_1 = tslib_1.__importDefault(require("./oa3toOa2Body"));
var generateTypeScriptInterfaceText_1 = tslib_1.__importDefault(require("../generate/generateTypeScriptInterfaceText"));
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ApiIs_1["default"].isOpenAPIorSwagger(this.apiObject)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.swaggerPathIterator(true)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!this.isAsyncAPI2()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.asyncChannelIterator(true)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw new Error('Unrecognised input format');
                }
            });
        });
    };
    /**
     * Merges the injected request params into single interface objects
     */
    OpenAPIInjectInterfaceNaming.prototype.mergeParameters = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ApiIs_1["default"].isOpenAPIorSwagger(this.apiObject)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.swaggerPathIterator(false)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!this.isAsyncAPI2()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.asyncChannelIterator(false)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw new Error('Unrecognised input format');
                }
            });
        });
    };
    /**
     * @param {string} ref
     * @return {string}
     */
    OpenAPIInjectInterfaceNaming.prototype.convertRefToOjectPath = function (ref) {
        var pathParts = [];
        var refParts = ref.split('/');
        for (var i = 0; i < refParts.length; ++i) {
            var part = refParts[i];
            if (part !== '#') {
                if (part.indexOf('.') !== -1) {
                    throw new Error('Component or definition using . found, please do not use a period for namespacing for now.');
                }
                pathParts.push(part);
            }
        }
        return pathParts.join('.');
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, path, _c, _d, _e, method;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!this.apiObject.paths) {
                            throw new Error('No paths found to iterate over');
                        }
                        _a = [];
                        for (_b in this.apiObject.paths)
                            _a.push(_b);
                        _i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        path = _a[_i];
                        if (!this.apiObject.paths.hasOwnProperty(path)) {
                            return [3 /*break*/, 6];
                        }
                        _c = [];
                        for (_d in this.apiObject.paths[path])
                            _c.push(_d);
                        _e = 0;
                        _f.label = 2;
                    case 2:
                        if (!(_e < _c.length)) return [3 /*break*/, 6];
                        method = _c[_e];
                        if (!this.apiObject.paths[path].hasOwnProperty(method)) {
                            return [3 /*break*/, 5];
                        }
                        if (!fromInject) return [3 /*break*/, 3];
                        this.openApiXRequestInjector(path, method);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.mergeSwaggerInjectedParameters('paths', path, method)];
                    case 4:
                        _f.sent();
                        _f.label = 5;
                    case 5:
                        _e++;
                        return [3 /*break*/, 2];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, this.apiObject];
                }
            });
        });
    };
    OpenAPIInjectInterfaceNaming.prototype.asyncChannelIterator = function (fromInject) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, channel;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.apiObject.channels) {
                            throw new Error('No paths found to iterate over');
                        }
                        _a = [];
                        for (_b in this.apiObject.channels)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        channel = _a[_i];
                        if (!this.apiObject.channels.hasOwnProperty(channel)) {
                            return [3 /*break*/, 6];
                        }
                        if (!fromInject) return [3 /*break*/, 2];
                        this.asyncXRequestInjector(channel);
                        return [3 /*break*/, 6];
                    case 2:
                        if (!this.apiObject.channels[channel].subscribe) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.mergeSwaggerInjectedParameters('channels', channel, 'subscribe')];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        if (!this.apiObject.channels[channel].publish) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.mergeSwaggerInjectedParameters('channels', channel, 'publish')];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, this.apiObject];
                }
            });
        });
    };
    /**
     * Injects the request and response object refs
     * @param channel
     */
    OpenAPIInjectInterfaceNaming.prototype.asyncXRequestInjector = function (channel) {
        if (this.apiObject.channels[channel].publish) {
            this.apiObject.channels[channel].publish['x-request-definitions'] = this.injectRequestDefinitionsFromChannels(channel, 'publish');
            this.apiObject.channels[channel].publish['x-response-definitions'] = this.injectResponseDefinitionsFromChannels(channel, 'publish');
        }
        if (this.apiObject.channels[channel].subscribe) {
            this.apiObject.channels[channel].subscribe['x-request-definitions'] = this.injectRequestDefinitionsFromChannels(channel, 'subscribe');
            this.apiObject.channels[channel].subscribe['x-response-definitions'] = this.injectResponseDefinitionsFromChannels(channel, 'subscribe');
        }
    };
    /**
     * Injects the parameter paths to the subscribe/publish channels
     * @param channel
     * @param action
     */
    OpenAPIInjectInterfaceNaming.prototype.injectRequestDefinitionsFromChannels = function (channel, action) {
        var _a;
        var requestParams = (_a = {},
            _a[action] = {
                name: _.upperFirst(),
                params: []
            },
            _a);
        if (!this.apiObject.channels[channel].parameters) {
            return {};
        }
        for (var key in this.apiObject.channels[channel].parameters) {
            var p = this.apiObject.channels[channel].parameters[key];
            requestParams[action].params.push(this.convertRefToOjectPath(p.$ref || p.schema.$ref));
        }
        return requestParams;
    };
    /**
     * Injects the object reference to the x-response-definitions
     * @param channel
     * @param action
     */
    OpenAPIInjectInterfaceNaming.prototype.injectResponseDefinitionsFromChannels = function (channel, action) {
        var response = {};
        var pathResponses = this.apiObject.channels[channel][action].message || false;
        if (pathResponses && pathResponses.payload && pathResponses.payload.$ref) {
            var responseInterface = this.convertRefToOjectPath(pathResponses.payload.$ref);
            responseInterface = responseInterface.split('.').pop();
            if (responseInterface) {
                response = responseInterface;
            }
        }
        return response;
    };
    /**
     * Injects param/definition paths
     * @param {string} path - Path of api
     * @param {string} method - Method of path to x inject to
     */
    OpenAPIInjectInterfaceNaming.prototype.openApiXRequestInjector = function (path, method) {
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
     * @param action
     * @param path
     * @param method
     */
    OpenAPIInjectInterfaceNaming.prototype.mergeSwaggerInjectedParameters = function (action, path, method) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _a, _b, _i, requestType;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _loop_1 = function (requestType) {
                            var requestObject, clear, interfaceName, _a;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!this_1.apiObject[action][path][method]['x-request-definitions'].hasOwnProperty(requestType)) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        requestObject = {};
                                        clear = true;
                                        this_1.apiObject[action][path][method]['x-request-definitions'][requestType].params.forEach(function (requestPath) {
                                            var parameterObject = _.get(_this.apiObject, requestPath);
                                            clear = false;
                                            if (requestType !== 'body') {
                                                var paramName = '\'' + parameterObject.name + '\'';
                                                if (ApiIs_1["default"].openapi3(_this.apiObject) || ApiIs_1["default"].asyncapi2(_this.apiObject)) {
                                                    // lift up the contents of schema
                                                    parameterObject = tslib_1.__assign(tslib_1.__assign({}, parameterObject), parameterObject.schema);
                                                }
                                                requestObject[paramName] = parameterObject;
                                            }
                                        });
                                        if (!!clear) return [3 /*break*/, 2];
                                        interfaceName = this_1.apiObject[action][path][method]['x-request-definitions'][requestType].name;
                                        _a = this_1.apiObject[action][path][method]['x-request-definitions'][requestType];
                                        return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"](interfaceName, requestObject)];
                                    case 1:
                                        _a.interfaceText = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        delete this_1.apiObject[action][path][method]['x-request-definitions'][requestType];
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = [];
                        for (_b in this.apiObject[action][path][method]['x-request-definitions'])
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        requestType = _a[_i];
                        return [5 /*yield**/, _loop_1(requestType)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Injects the request interface naming for the response objects
     * @param path
     * @param method
     * @return {{'200': null}}
     */
    OpenAPIInjectInterfaceNaming.prototype.injectFromSwaggerResponse = function (path, method) {
        if (ApiIs_1["default"].openapi3(this.apiObject)) {
            return this.injectFromOA3Response(path, method);
        }
        if (ApiIs_1["default"].swagger(this.apiObject) || ApiIs_1["default"].openapi2(this.apiObject)) {
            return this.injectFromOA2Response(path, method);
        }
    };
    OpenAPIInjectInterfaceNaming.prototype.injectFromOA2Response = function (path, method) {
        var response = {};
        var pathResponses = this.apiObject.paths[path][method].responses || false;
        if (pathResponses && pathResponses['200'] && pathResponses['200'].schema && pathResponses['200'].schema.$ref) {
            try {
                var responseInterface = this.convertRefToOjectPath(pathResponses['200'].schema.$ref)
                    .split('.')
                    .pop();
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
