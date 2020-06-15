"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var _ = tslib_1.__importStar(require("lodash"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var YAML = tslib_1.__importStar(require("js-yaml"));
var OpenAPIInjectInterfaceNaming_1 = tslib_1.__importDefault(require("./OpenAPIInjectInterfaceNaming"));
var openApiResolveAllOfs_1 = tslib_1.__importDefault(require("./openApiResolveAllOfs"));
var generateTypeScriptInterfaceText_1 = tslib_1.__importDefault(require("../generate/generateTypeScriptInterfaceText"));
var ucFirst_1 = tslib_1.__importDefault(require("../template/helpers/ucFirst"));
var ApiIs_1 = tslib_1.__importDefault(require("../helpers/ApiIs"));
var includeOperationNameAction_1 = tslib_1.__importDefault(require("../helpers/includeOperationNameAction"));
var RefParser = require('json-schema-ref-parser');
var OpenAPIBundler = /** @class */ (function () {
    function OpenAPIBundler() {
    }
    /**
     *
     * @param filePath
     * @param config
     */
    OpenAPIBundler.prototype.bundle = function (filePath, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var content, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('Reading file: ' + filePath);
                        content = fs_extra_1["default"].readFileSync(filePath);
                        this.copyInputFileToProject(filePath, config.targetDir);
                        console.log('Parsing file contents');
                        content = this.parseContent(content);
                        console.log('Injecting path interface names');
                        return [4 /*yield*/, (new OpenAPIInjectInterfaceNaming_1["default"](content, config)).inject()];
                    case 1:
                        content = _b.sent();
                        console.log('De-referencing object');
                        return [4 /*yield*/, this.dereference(content)];
                    case 2:
                        content = _b.sent();
                        console.log('Calculating all request definitions to interface relations');
                        return [4 /*yield*/, (new OpenAPIInjectInterfaceNaming_1["default"](content, config)).mergeParameters()];
                    case 3:
                        content = _b.sent();
                        console.log('Resolving all allOf references');
                        content = openApiResolveAllOfs_1["default"](content);
                        console.log('Injecting interface texts');
                        return [4 /*yield*/, this.injectInterfaces(content, config)];
                    case 4:
                        content = _b.sent();
                        console.log('Injecting operationId array');
                        _a = content;
                        return [4 /*yield*/, this.fetchOperationIdsArray(content)];
                    case 5:
                        _a.operationIds = _b.sent();
                        console.log('Bundling the full object');
                        return [4 /*yield*/, this.bundleObject(content)];
                    case 6:
                        content = _b.sent();
                        console.log('Injecting the endpoint names');
                        return [2 /*return*/, JSON.parse(JSON.stringify(this.pathEndpointInjection(content, config)))];
                }
            });
        });
    };
    /**
     * Writes a copy of the input swagger file to the root of the project
     * @param filepath
     * @param targetDir
     */
    OpenAPIBundler.prototype.copyInputFileToProject = function (filepath, targetDir) {
        var saveTo = path_1["default"].join(targetDir, 'openapi-nodegen-api-file.yml');
        console.log('Writing the input yml file to: ' + saveTo);
        fs_extra_1["default"].copyFileSync(filepath, saveTo);
    };
    /**
     * JSON load and parse a .json file or .y(a)ml file
     * @param content
     */
    OpenAPIBundler.prototype.parseContent = function (content) {
        content = content.toString('utf8');
        try {
            return JSON.parse(content);
        }
        catch (e) {
            return YAML.safeLoad(content);
        }
    };
    /**
     * Dereference the swagger/openapi object
     * @param json
     */
    OpenAPIBundler.prototype.dereference = function (json) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, RefParser.dereference(json, {
                        dereference: {
                            circular: 'ignore'
                        }
                    })];
            });
        });
    };
    /**
     *
     * @param json
     */
    OpenAPIBundler.prototype.bundleObject = function (json) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, RefParser.bundle(json, {
                        dereference: {
                            circular: 'ignore'
                        }
                    })];
            });
        });
    };
    /**
     * Returns a simple array of uniqueOperationids from either asyncApi or swagger/openapi
     * @param yamlObject
     */
    OpenAPIBundler.prototype.fetchOperationIdsArray = function (yamlObject) {
        var ids = [];
        if (yamlObject.paths) {
            for (var pathMethod in yamlObject.paths) {
                if (yamlObject.paths[pathMethod].operationId) {
                    var id = yamlObject.paths[pathMethod].operationId;
                    if (!ids.includes(id)) {
                        ids.push(id);
                    }
                }
            }
        }
        else if (yamlObject.channels) {
            for (var channel in yamlObject.channels) {
                if (yamlObject.channels[channel].subscribe) {
                    var subid = yamlObject.channels[channel].subscribe.operationId;
                    if (!ids.includes(subid)) {
                        ids.push(subid);
                    }
                }
                if (yamlObject.channels[channel].publish) {
                    var pubid = yamlObject.channels[channel].publish.operationId;
                    if (!ids.includes(pubid)) {
                        ids.push(pubid);
                    }
                }
            }
        }
        return ids;
    };
    /**
     * Iterates over the paths, methods and their calculated x-request-definitions to calculate the interface content.
     * @param apiObject Dereference'd' object
     * @param config
     * @return {Promise<void>}
     */
    OpenAPIBundler.prototype.injectInterfaces = function (apiObject, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiObject.interfaces = [];
                        return [4 /*yield*/, this.injectDefinitionInterfaces(apiObject)];
                    case 1:
                        apiObject = _a.sent();
                        if (!ApiIs_1["default"].isOpenAPIorSwagger(apiObject)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.injectParameterInterfaces(apiObject)];
                    case 2:
                        apiObject = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (ApiIs_1["default"].asyncapi2(apiObject)) {
                            // TODO complete the parameters for async api apiObject = await this.injectParameterInterfacesFromAsyncApi(apiObject, config);
                            // TODO this was left as not required for rabbitmq
                        }
                        _a.label = 4;
                    case 4:
                        apiObject.interfaces = apiObject.interfaces.sort(function (a, b) { return (a.name > b.name) ? 1 : -1; });
                        apiObject.interfaces = _.uniqBy(apiObject.interfaces, 'name');
                        return [2 /*return*/, apiObject];
                }
            });
        });
    };
    /**
     * Iterates over the definitions already known to generate the respective interfaces
     * @param apiObject
     * @return apiObject
     */
    OpenAPIBundler.prototype.injectDefinitionInterfaces = function (apiObject) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toWalk, defKeys, i, definitionObject, _a, _b, _c, e_1;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // edge case for api's without any definitions or component schemas
                        if (ApiIs_1["default"].swagger(apiObject) && !apiObject.definitions
                            || ApiIs_1["default"].openapi3(apiObject) && (!apiObject.components || !apiObject.components.schemas)) {
                            return [2 /*return*/, apiObject];
                        }
                        toWalk = (ApiIs_1["default"].swagger(apiObject)) ? apiObject.definitions : (ApiIs_1["default"].openapi3(apiObject) || ApiIs_1["default"].asyncapi2(apiObject)) ? apiObject.components.schemas : {};
                        defKeys = Object.keys(toWalk);
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < defKeys.length)) return [3 /*break*/, 6];
                        definitionObject = (ApiIs_1["default"].swagger(apiObject)) ?
                            apiObject.definitions[defKeys[i]] :
                            (ApiIs_1["default"].openapi3(apiObject) || ApiIs_1["default"].asyncapi2(apiObject)) ?
                                apiObject.components.schemas[defKeys[i]] : {};
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        _b = (_a = apiObject.interfaces).push;
                        _c = {
                            name: defKeys[i]
                        };
                        return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"](defKeys[i], JSON.stringify(definitionObject))];
                    case 3:
                        _b.apply(_a, [(_c.content = _d.sent(),
                                _c)]);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _d.sent();
                        console.log(defKeys[i]);
                        console.log(e_1);
                        throw new Error('Could not generate the interface text for the above object');
                    case 5:
                        ++i;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, apiObject];
                }
            });
        });
    };
    /**
     * Iterates over all path generating interface texts from the json schema in the request definitions
     */
    OpenAPIBundler.prototype.injectParameterInterfaces = function (apiObject) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pathsKeys, i, thisPath, thisPathsMethods, j, thisMethod, thisMethodXRequestionDefinitions, xRequestDefinitionsKeys, k, paramType, param, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pathsKeys = Object.keys(apiObject.paths);
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < pathsKeys.length)) return [3 /*break*/, 9];
                        thisPath = pathsKeys[i];
                        thisPathsMethods = Object.keys(apiObject.paths[thisPath]);
                        j = 0;
                        _b.label = 2;
                    case 2:
                        if (!(j < thisPathsMethods.length)) return [3 /*break*/, 8];
                        thisMethod = thisPathsMethods[j];
                        thisMethodXRequestionDefinitions = apiObject.paths[thisPath][thisMethod]['x-request-definitions'];
                        if (!thisMethodXRequestionDefinitions) {
                            return [3 /*break*/, 7];
                        }
                        xRequestDefinitionsKeys = Object.keys(thisMethodXRequestionDefinitions);
                        k = 0;
                        _b.label = 3;
                    case 3:
                        if (!(k < xRequestDefinitionsKeys.length)) return [3 /*break*/, 7];
                        paramType = xRequestDefinitionsKeys[k];
                        if (!(paramType === 'body')) return [3 /*break*/, 5];
                        param = void 0;
                        try {
                            param = apiObject.paths[thisPath][thisMethod]['x-request-definitions'][paramType].params[0];
                            param.name = ucFirst_1["default"](param.name);
                        }
                        catch (e) {
                            console.error('Error with a body request parameter:');
                            console.error(apiObject.paths[thisPath][thisMethod]['x-request-definitions'][paramType]);
                            throw e;
                        }
                        _a = thisMethodXRequestionDefinitions[paramType];
                        return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"](param.name, JSON.stringify(_.get(apiObject, param.path)))];
                    case 4:
                        _a.interfaceText = _b.sent();
                        apiObject.interfaces.push({
                            name: param.name,
                            content: thisMethodXRequestionDefinitions[paramType].interfaceText
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        // handle the rest
                        apiObject.interfaces.push({
                            name: apiObject.paths[thisPath][thisMethod]['x-request-definitions'][paramType].name,
                            content: apiObject.paths[thisPath][thisMethod]['x-request-definitions'][paramType].interfaceText
                        });
                        _b.label = 6;
                    case 6:
                        ++k;
                        return [3 /*break*/, 3];
                    case 7:
                        ++j;
                        return [3 /*break*/, 2];
                    case 8:
                        ++i;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, apiObject];
                }
            });
        });
    };
    /**
     * Injects the end-points into each path object
     */
    OpenAPIBundler.prototype.pathEndpointInjection = function (apiObject, config) {
        apiObject.basePath = apiObject.basePath || '';
        var objects = apiObject.channels || apiObject.paths;
        for (var pathName in objects) {
            var pathObject = objects[pathName];
            var endpointName = pathName === '/' ? 'root' : pathName.split('/')[1];
            if (includeOperationNameAction_1["default"](endpointName, pathObject, config.nodegenRc)) {
                pathObject.endpointName = endpointName;
            }
        }
        apiObject.endpoints = _.uniq(_.map(apiObject.channels || apiObject.paths, 'endpointName')).filter(function (item) {
            return typeof item === 'string';
        });
        return apiObject;
    };
    return OpenAPIBundler;
}());
exports["default"] = new OpenAPIBundler();
