"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var GeneratedComparison_1 = tslib_1.__importDefault(require("./GeneratedComparison"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var commandRun_1 = tslib_1.__importDefault(require("../../utils/commandRun"));
exports["default"] = (function (mainInterfaceName, definitionObject, targetDir) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var baseInterfaceDir, tmpJsonSchema, e_1;
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
                        path_1["default"].join('./node_modules/quicktype/dist/cli/index.js'),
                        '--just-types',
                        '--src',
                        tmpJsonSchema,
                        '--src-lang',
                        'schema',
                        '--acronym-style',
                        'original',
                        '--top-level',
                        mainInterfaceName,
                        '--lang',
                        'ts',
                    ])];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                throw new Error('quicktype error, full input json used: ' + tmpJsonSchema);
            case 4: return [2 /*return*/];
        }
    });
}); });
