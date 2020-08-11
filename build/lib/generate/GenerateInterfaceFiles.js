"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var NamingUtils_1 = tslib_1.__importDefault(require("../helpers/NamingUtils"));
var TemplateRenderer_1 = tslib_1.__importDefault(require("../template/TemplateRenderer"));
var GenerateInterfaceFiles = /** @class */ (function () {
    function GenerateInterfaceFiles(config) {
        this.config = config;
    }
    GenerateInterfaceFiles.prototype.writeFiles = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var swagger;
            return tslib_1.__generator(this, function (_a) {
                swagger = this.config.data.swagger;
                this.iterateInterfaces(swagger);
                return [2 /*return*/];
            });
        });
    };
    GenerateInterfaceFiles.prototype.iterateInterfaces = function (swagger) {
        var _this = this;
        swagger.interfaces.forEach(function (interace) {
            _this.parseDefinition(interace.content.outputString, interace.name);
        });
    };
    GenerateInterfaceFiles.prototype.parseDefinition = function (interfaceText, definitionName) {
        var filePath = path_1["default"].join(this.config.root, this.config.file_name);
        var data = fs_extra_1["default"].readFileSync(filePath, 'utf8');
        var subdir = this.config.root.replace(new RegExp(this.config.templates_dir + "[/]?"), '');
        var ext = NamingUtils_1["default"].getFileExt(this.config.file_name);
        var newFilename = definitionName + '.' + ext;
        var targetFile = path_1["default"].resolve(this.config.targetDir, subdir, newFilename);
        var content = TemplateRenderer_1["default"].load(data.toString(), tslib_1.__assign({ definitionName: definitionName, definitionInterfaceText: interfaceText, nodegenRc: this.config.data.nodegenRc }, this.config.data.variables), ext);
        fs_extra_1["default"].writeFileSync(targetFile, content, 'utf8');
        return true;
    };
    return GenerateInterfaceFiles;
}());
exports["default"] = GenerateInterfaceFiles;
