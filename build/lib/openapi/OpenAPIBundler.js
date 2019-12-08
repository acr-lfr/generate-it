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
            var content, e_1, e_2, e_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            content = fs_extra_1["default"].readFileSync(path_1["default"].resolve(__dirname, filePath));
                        }
                        catch (e) {
                            console.error('Can not load the content of the Swagger specification file');
                            console.log(filePath);
                            throw e;
                        }
                        try {
                            content = this.parseContent(content);
                        }
                        catch (e) {
                            console.error('Can not parse the content of the Swagger specification file');
                            global.verboseLogging(content);
                            throw e;
                        }
                        try {
                            content = (new OpenAPIInjectInterfaceNaming_1["default"](content, config)).inject();
                        }
                        catch (e) {
                            console.error('Cannot inject interface naming for:');
                            global.verboseLogging(JSON.stringify(content, undefined, 2));
                            throw e;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dereference(content)];
                    case 2:
                        content = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error('Can not dereference the JSON obtained from the content of the Swagger specification file:');
                        global.verboseLogging(JSON.stringify(content, undefined, 2));
                        throw e_1;
                    case 4:
                        try {
                            content = (new OpenAPIInjectInterfaceNaming_1["default"](content, config)).mergeParameters();
                        }
                        catch (e) {
                            console.error('Can not merge the request paramters to build the interfaces:');
                            global.verboseLogging(JSON.stringify(content, undefined, 2));
                            throw e;
                        }
                        try {
                            content = openApiResolveAllOfs_1["default"](content);
                        }
                        catch (e) {
                            console.error('Could not resolve of allOfs');
                            global.verboseLogging(JSON.stringify(content, undefined, 2));
                            throw e;
                        }
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.injectInterfaces(content, config)];
                    case 6:
                        content = _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _a.sent();
                        console.error('Cannot inject the interfaces: ');
                        global.verboseLogging(JSON.stringify(content, undefined, 2));
                        throw e_2;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.bundleObject(content)];
                    case 9:
                        content = _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        e_3 = _a.sent();
                        console.error('Cannot bundle the object:');
                        throw e_3;
                    case 11:
                        global.verboseLogging(content);
                        return [2 /*return*/, JSON.parse(JSON.stringify(this.pathEndpointInjection(content)))];
                }
            });
        });
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
     * Iterates over the paths, methods and their calculated x-request-definitions to calculate the interface content.
     * @param apiObject Dereference'd' object
     * @param config
     * @return {Promise<void>}
     */
    OpenAPIBundler.prototype.injectInterfaces = function (apiObject, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pathsKeys, i, singlePath, methods, j, method, xRequestDefinitions, xRequestDefinitionsKeys, k, paramType, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiObject.interfaces = [];
                        return [4 /*yield*/, this.injectDefinitionInterfaces(apiObject, config)];
                    case 1:
                        apiObject = _b.sent();
                        pathsKeys = Object.keys(apiObject.paths);
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < pathsKeys.length)) return [3 /*break*/, 10];
                        singlePath = pathsKeys[i];
                        methods = Object.keys(apiObject.paths[singlePath]);
                        j = 0;
                        _b.label = 3;
                    case 3:
                        if (!(j < methods.length)) return [3 /*break*/, 9];
                        method = methods[j];
                        xRequestDefinitions = apiObject.paths[singlePath][method]['x-request-definitions'];
                        if (!xRequestDefinitions) return [3 /*break*/, 8];
                        xRequestDefinitionsKeys = Object.keys(xRequestDefinitions);
                        k = 0;
                        _b.label = 4;
                    case 4:
                        if (!(k < xRequestDefinitionsKeys.length)) return [3 /*break*/, 8];
                        paramType = xRequestDefinitionsKeys[k];
                        if (!(xRequestDefinitions[paramType].interfaceText === '' && xRequestDefinitions[paramType].params.length > 0)) return [3 /*break*/, 6];
                        _a = xRequestDefinitions[paramType];
                        return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"](apiObject.paths[singlePath][method]['x-request-definitions'][paramType].name, _.get(apiObject, apiObject.paths[singlePath][method]['x-request-definitions'][paramType].params[0]), config.targetDir)];
                    case 5:
                        _a.interfaceText = _b.sent();
                        _b.label = 6;
                    case 6:
                        apiObject.interfaces.push({
                            name: apiObject.paths[singlePath][method]['x-request-definitions'][paramType].name,
                            content: apiObject.paths[singlePath][method]['x-request-definitions'][paramType].interfaceText
                        });
                        _b.label = 7;
                    case 7:
                        ++k;
                        return [3 /*break*/, 4];
                    case 8:
                        ++j;
                        return [3 /*break*/, 3];
                    case 9:
                        ++i;
                        return [3 /*break*/, 2];
                    case 10:
                        apiObject.interfaces = apiObject.interfaces.sort(function (a, b) { return (a.name > b.name) ? 1 : -1; });
                        return [2 /*return*/, apiObject];
                }
            });
        });
    };
    /**
     * Iterates over the definitions already known to generate the respective interfaces
     * @param apiObject
     * @param config
     * @return apiObject
     */
    OpenAPIBundler.prototype.injectDefinitionInterfaces = function (apiObject, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var defKeys, i, definitionObject, _a, _b, _c, e_4;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        defKeys = Object.keys(apiObject.definitions);
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < defKeys.length)) return [3 /*break*/, 6];
                        definitionObject = apiObject.definitions[defKeys[i]];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        _b = (_a = apiObject.interfaces).push;
                        _c = {
                            name: defKeys[i]
                        };
                        return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"](defKeys[i], definitionObject, config.targetDir)];
                    case 3:
                        _b.apply(_a, [(_c.content = _d.sent(),
                                _c)]);
                        return [3 /*break*/, 5];
                    case 4:
                        e_4 = _d.sent();
                        console.log(defKeys[i]);
                        console.log(e_4);
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
     * Injects the end-points into each path object
     * @param apiObject
     */
    OpenAPIBundler.prototype.pathEndpointInjection = function (apiObject) {
        apiObject.basePath = apiObject.basePath || '';
        _.each(apiObject.paths, function (pathObject, pathName) {
            pathObject.endpointName = pathName === '/' ? 'root' : pathName.split('/')[1];
        });
        apiObject.endpoints = _.uniq(_.map(apiObject.paths, 'endpointName'));
        return apiObject;
    };
    return OpenAPIBundler;
}());
exports["default"] = new OpenAPIBundler();
