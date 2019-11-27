"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var NodegenRc_1 = tslib_1.__importDefault(require("./NodegenRc"));
var _ = tslib_1.__importStar(require("lodash"));
/**
 * Creates an extended config object
 * @param {object} config
 * @param {object} swagger
 * @param templates
 * @return {Promise<{mockServer}|*>}
 */
var ConfigMerger = /** @class */ (function () {
    function ConfigMerger() {
    }
    ConfigMerger.prototype.base = function (config, templatesDir) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nodegenRc;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, NodegenRc_1["default"].fetch(templatesDir, config.targetDir)];
                    case 1:
                        nodegenRc = _a.sent();
                        return [2 /*return*/, Object.assign(config, {
                                templates: templatesDir,
                                nodegenRc: nodegenRc,
                                interfaceStyle: nodegenRc.interfaceStyle || 'interface'
                            })];
                }
            });
        });
    };
    ConfigMerger.prototype.injectSwagger = function (config, swagger) {
        return Object.assign(config, {
            swagger: swagger,
            package: {
                name: _.kebabCase(swagger.info.title)
            }
        });
    };
    return ConfigMerger;
}());
exports["default"] = new ConfigMerger();
