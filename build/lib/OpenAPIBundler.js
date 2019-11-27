"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var _ = tslib_1.__importStar(require("lodash"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var YAML = tslib_1.__importStar(require("js-yaml"));
var commandRun_1 = tslib_1.__importDefault(require("./commandRun"));
var OpenAPIInjectInterfaceNaming_1 = tslib_1.__importDefault(require("./OpenAPIInjectInterfaceNaming"));
var GeneratedComparison_1 = tslib_1.__importDefault(require("./GeneratedComparison"));
var openApiResolveAllOfs_1 = tslib_1.__importDefault(require("./openApiResolveAllOfs"));
var RefParser = require('json-schema-ref-parser');
var OpenAPIBundler = /** @class */ (function () {
    function OpenAPIBundler() {
    }
    OpenAPIBundler.prototype.bundle = function (filePath, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var content, parsedContent, parsedContentWithInterfaceNaming, dereferencedJSON, mergedParameters, resolvedAllOf, injectedInterfaces, bundledJSON, e_1, e_2, e_3, e_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getFileContent(filePath)];
                    case 1:
                        content = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error('Can not load the content of the Swagger specification file');
                        console.log(filePath);
                        throw e_1;
                    case 3:
                        try {
                            parsedContent = this.parseContent(content);
                        }
                        catch (e) {
                            console.error('Can not parse the content of the Swagger specification file');
                            global.verboseLogging(content);
                            throw e;
                        }
                        try {
                            parsedContentWithInterfaceNaming = (new OpenAPIInjectInterfaceNaming_1["default"](parsedContent, config)).inject();
                        }
                        catch (e) {
                            console.error('Can inject interface naming for:');
                            global.verboseLogging(JSON.stringify(parsedContent, undefined, 2));
                            throw e;
                        }
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.dereference(parsedContentWithInterfaceNaming)];
                    case 5:
                        dereferencedJSON = _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_2 = _a.sent();
                        console.error('Can not dereference the JSON obtained from the content of the Swagger specification file:');
                        global.verboseLogging(JSON.stringify(parsedContentWithInterfaceNaming, undefined, 2));
                        throw e_2;
                    case 7:
                        try {
                            mergedParameters = (new OpenAPIInjectInterfaceNaming_1["default"](dereferencedJSON, config)).mergeParameters();
                        }
                        catch (e) {
                            console.error('Can not merge the request paramters to build the interfaces:');
                            global.verboseLogging(JSON.stringify(dereferencedJSON, undefined, 2));
                            throw e;
                        }
                        try {
                            resolvedAllOf = openApiResolveAllOfs_1["default"](mergedParameters);
                        }
                        catch (e) {
                            console.error('Could not resolve of allOfs');
                            global.verboseLogging(JSON.stringify(dereferencedJSON, undefined, 2));
                            throw e;
                        }
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.injectInterfaces(resolvedAllOf, config)];
                    case 9:
                        injectedInterfaces = _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        e_3 = _a.sent();
                        console.error('Cannot inject the interfaces: ');
                        global.verboseLogging(JSON.stringify(mergedParameters, undefined, 2));
                        throw e_3;
                    case 11:
                        _a.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, this.bundleObject(injectedInterfaces)];
                    case 12:
                        bundledJSON = _a.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        e_4 = _a.sent();
                        console.error('Cannot bundle the object:');
                        throw e_4;
                    case 14:
                        global.verboseLogging(bundledJSON);
                        return [2 /*return*/, JSON.parse(JSON.stringify(bundledJSON))];
                }
            });
        });
    };
    OpenAPIBundler.prototype.getFileContent = function (filePath) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, fs_extra_1["default"].readFileSync(path_1["default"].resolve(__dirname, filePath))];
            });
        });
    };
    OpenAPIBundler.prototype.parseContent = function (content) {
        content = content.toString('utf8');
        try {
            return JSON.parse(content);
        }
        catch (e) {
            return YAML.safeLoad(content);
        }
    };
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
     *
     * @param apiObject Dereference'd' object
     * @param config
     * @return {Promise<void>}
     */
    OpenAPIBundler.prototype.injectInterfaces = function (apiObject, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var defKeys, i, definitionObject, _a, _b, _c, e_5, pathsKeys, i, singlePath, methods, j, method, xRequestDefinitions, xRequestDefinitionsKeys, k, paramType, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        apiObject.interfaces = [];
                        defKeys = Object.keys(apiObject.definitions);
                        i = 0;
                        _e.label = 1;
                    case 1:
                        if (!(i < defKeys.length)) return [3 /*break*/, 6];
                        definitionObject = apiObject.definitions[defKeys[i]];
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 4, , 5]);
                        _b = (_a = apiObject.interfaces).push;
                        _c = {
                            name: defKeys[i]
                        };
                        return [4 /*yield*/, this.generateInterfaceText(defKeys[i], definitionObject, config.targetDir)];
                    case 3:
                        _b.apply(_a, [(_c.content = _e.sent(),
                                _c)]);
                        return [3 /*break*/, 5];
                    case 4:
                        e_5 = _e.sent();
                        console.log(defKeys[i]);
                        console.log(e_5);
                        throw new Error('Could not generate the interface text for the above object');
                    case 5:
                        ++i;
                        return [3 /*break*/, 1];
                    case 6:
                        pathsKeys = Object.keys(apiObject.paths);
                        i = 0;
                        _e.label = 7;
                    case 7:
                        if (!(i < pathsKeys.length)) return [3 /*break*/, 15];
                        singlePath = pathsKeys[i];
                        methods = Object.keys(apiObject.paths[singlePath]);
                        j = 0;
                        _e.label = 8;
                    case 8:
                        if (!(j < methods.length)) return [3 /*break*/, 14];
                        method = methods[j];
                        xRequestDefinitions = apiObject.paths[singlePath][method]['x-request-definitions'];
                        if (!xRequestDefinitions) return [3 /*break*/, 13];
                        xRequestDefinitionsKeys = Object.keys(xRequestDefinitions);
                        k = 0;
                        _e.label = 9;
                    case 9:
                        if (!(k < xRequestDefinitionsKeys.length)) return [3 /*break*/, 13];
                        paramType = xRequestDefinitionsKeys[k];
                        if (!(xRequestDefinitions[paramType].interfaceText === '' &&
                            xRequestDefinitions[paramType].params.length > 0)) return [3 /*break*/, 11];
                        _d = xRequestDefinitions[paramType];
                        return [4 /*yield*/, this.generateInterfaceText(apiObject.paths[singlePath][method]['x-request-definitions'][paramType].name, _.get(apiObject, apiObject.paths[singlePath][method]['x-request-definitions'][paramType].params[0]), config.targetDir)];
                    case 10:
                        _d.interfaceText = _e.sent();
                        _e.label = 11;
                    case 11:
                        apiObject.interfaces.push({
                            name: apiObject.paths[singlePath][method]['x-request-definitions'][paramType].name,
                            content: apiObject.paths[singlePath][method]['x-request-definitions'][paramType].interfaceText
                        });
                        _e.label = 12;
                    case 12:
                        ++k;
                        return [3 /*break*/, 9];
                    case 13:
                        ++j;
                        return [3 /*break*/, 8];
                    case 14:
                        ++i;
                        return [3 /*break*/, 7];
                    case 15:
                        apiObject.interfaces = apiObject.interfaces.sort(function (a, b) { return (a.name > b.name) ? 1 : -1; });
                        return [2 /*return*/, apiObject];
                }
            });
        });
    };
    OpenAPIBundler.prototype.generateInterfaceText = function (mainInterfaceName, definitionObject, targetDir) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var baseInterfaceDir, tmpJsonSchema, e_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseInterfaceDir = path_1["default"].join(GeneratedComparison_1["default"].getCacheBaseDir(targetDir), 'interface');
                        fs_extra_1["default"].ensureDirSync(baseInterfaceDir);
                        tmpJsonSchema = path_1["default"].join(baseInterfaceDir, mainInterfaceName + '.json');
                        // write the json to disk
                        fs_extra_1["default"].writeJsonSync(tmpJsonSchema, definitionObject);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, commandRun_1["default"]('node', [
                                path_1["default"].join(__dirname, '../../node_modules/quicktype/dist/cli/index.js'),
                                '--just-types',
                                '--src',
                                tmpJsonSchema,
                                '--src-lang',
                                'schema',
                                '--lang',
                                'ts',
                            ])];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_6 = _a.sent();
                        console.error(e_6);
                        throw new Error('quicktype error, full input json used: ' + tmpJsonSchema);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return OpenAPIBundler;
}());
exports["default"] = new OpenAPIBundler();
