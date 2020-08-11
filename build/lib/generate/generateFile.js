"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var NamingUtils_1 = tslib_1.__importDefault(require("../helpers/NamingUtils"));
var TemplateRenderer_1 = tslib_1.__importDefault(require("../template/TemplateRenderer"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var generateFileDoWrite_1 = tslib_1.__importDefault(require("./generateFileDoWrite"));
/**
 * Generates a file.
 *
 * @private
 * @param  {GenerateOperationFileConfig} config
 * @param  {Boolean} isFirstRun
 * @param  {Object} [additionalTplObject]  An additional object that will be passed to the tpl, defaults to an empty object
 * @param  {string }nodegenDir
 * @return {Promise}
 */
exports["default"] = (function (config, isFirstRun, additionalTplObject, nodegenDir) {
    if (additionalTplObject === void 0) { additionalTplObject = {}; }
    var templatesDir = config.templates_dir;
    var targetDir = config.targetDir;
    var fileName = config.file_name;
    var root = config.root;
    // const data = config.data
    var loadFilePath = (fileName !== 'package.json.njk') ?
        path_1["default"].resolve(root, fileName) :
        path_1["default"].resolve(process.cwd(), 'package.json');
    var templatePath = path_1["default"].resolve(targetDir, path_1["default"].relative(templatesDir, path_1["default"].resolve(root, fileName)));
    // should write or not
    if (!generateFileDoWrite_1["default"](isFirstRun, templatePath, root, nodegenDir)) {
        return;
    }
    // This could be a new file in the templates, ensure the dir structure is present before preceding
    fs_extra_1["default"].ensureFileSync(templatePath);
    global.veryVerboseLogging('Parsing/placing file: ' + templatePath);
    var content = fs_extra_1["default"].readFileSync(loadFilePath, 'utf8');
    var renderedContent = TemplateRenderer_1["default"].load(content, tslib_1.__assign({ package: config.package, swagger: config.data.swagger, endpoints: config.data.swagger.endpoints, definitions: config.data.swagger.definitions ? Object.keys(config.data.swagger.definitions) : [], additionalTplObject: additionalTplObject, nodegenRc: config.data.nodegenRc }, config.data.variables));
    var generatedPath = path_1["default"].resolve(targetDir, path_1["default"].relative(templatesDir, path_1["default"].resolve(root, NamingUtils_1["default"].stripNjkExtension(fileName))));
    return fs_extra_1["default"].writeFileSync(generatedPath, renderedContent, 'utf8');
});
