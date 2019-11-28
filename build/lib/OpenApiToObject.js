"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var _ = tslib_1.__importStar(require("lodash"));
var word_wrap_1 = tslib_1.__importDefault(require("word-wrap"));
var ValidHttpMethods_1 = tslib_1.__importDefault(require("../constants/ValidHttpMethods"));
var generateOperationId_1 = tslib_1.__importDefault(require("./generateOperationId"));
var OpenAPIBundler_1 = tslib_1.__importDefault(require("./OpenAPIBundler"));
var OpenApiToObject = /** @class */ (function () {
    /**
     * @param  {Object} config File path to Swagger file or **fully bundled and dereferenced** Swagger JS object.
     */
    function OpenApiToObject(config) {
        this.apiFile = config.swaggerFilePath;
        this.config = config;
    }
    OpenApiToObject.prototype.build = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof this.apiFile === 'string')) return [3 /*break*/, 2];
                        _a = this.iterateObject;
                        return [4 /*yield*/, OpenAPIBundler_1["default"].bundle(this.apiFile, this.config)];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                    case 2:
                        if (typeof this.apiFile !== 'object') {
                            throw new Error("Could not find a valid swagger definition: " + this.apiFile);
                        }
                        else {
                            return [2 /*return*/, this.iterateObject(this.apiFile)];
                        }
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenApiToObject.prototype.iterateObject = function (apiObject) {
        apiObject.basePath = apiObject.basePath || '';
        _.each(apiObject.paths, function (path, pathName) {
            path.endpointName = pathName === '/' ? 'root' : pathName.split('/')[1];
            _.each(path, function (method, methodName) {
                if (ValidHttpMethods_1["default"].indexOf(methodName.toUpperCase()) === -1) {
                    return;
                }
                method.operationId = _.camelCase(method.operationId || generateOperationId_1["default"](methodName, pathName).replace(/\s/g, '-'));
                method.descriptionLines = word_wrap_1["default"](method.description || method.summary || '', {
                    width: 60, indent: ''
                }).split(/\n/);
                _.each(method.parameters, function (param) {
                    param.type = param.type || (param.schema ? param.schema.type : undefined);
                });
            });
        });
        apiObject.endpoints = _.uniq(_.map(apiObject.paths, 'endpointName'));
        return apiObject;
    };
    return OpenApiToObject;
}());
exports["default"] = OpenApiToObject;
