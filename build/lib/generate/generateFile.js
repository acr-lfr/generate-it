"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var NamingUtils_1 = tslib_1.__importDefault(require("../helpers/NamingUtils"));
var TemplateRenderer_1 = tslib_1.__importDefault(require("../template/TemplateRenderer"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var _ = tslib_1.__importStar(require("lodash"));
var path_1 = tslib_1.__importDefault(require("path"));
/**
 * Generates a file.
 *
 * @private
 * @param  {Object} config
 * @param  {String} config.templates_dir Directory where the templates live.
 * @param  {String} config.targetDir     Directory where the file will be generated.
 * @param  {String} config.file_name     Name of the generated file.
 * @param  {String} config.root          Root directory.
 * @param  {Object} config.data          Data to pass to the helpers.
 * @param  {Boolean} isFirstRun
 * @param  {Object} [additionalTplObject]  An additional object that will be passed to the tpl, defaults to an empty object
 * @return {Promise}
 */
exports["default"] = (function (config, isFirstRun, additionalTplObject) {
    if (additionalTplObject === void 0) { additionalTplObject = {}; }
    var templatesDir = config.templates_dir;
    var targetDir = config.targetDir;
    var fileName = config.file_name;
    var root = config.root;
    // const data = config.data
    var loadFilePath = (fileName !== 'package.json.njk') ? path_1["default"].resolve(root, fileName) : path_1["default"].resolve(process.cwd(), 'package.json');
    var templatePath = path_1["default"].resolve(targetDir, path_1["default"].relative(templatesDir, path_1["default"].resolve(root, fileName)));
    // should write or not
    if (!isFirstRun || fs_extra_1["default"].existsSync(NamingUtils_1["default"].stripNjkExtension(templatePath)) || !root.includes('/http/nodegen')) {
        return;
    }
    // This could be a new file in the templates, ensure the dir structure is present before preceding
    fs_extra_1["default"].ensureFileSync(templatePath);
    global.veryVerboseLogging('Parsing/placing file: ' + templatePath);
    var content = fs_extra_1["default"].readFileSync(loadFilePath, 'utf8');
    var endpoints = [];
    if (fileName.startsWith('routesImporter')) {
        _.each(config.data.swagger.paths, function (operationPath) {
            var operationName = operationPath.endpointName;
            if (!endpoints.includes(operationName)) {
                endpoints.push(operationName);
            }
        });
    }
    var renderedContent = TemplateRenderer_1["default"].load(content, {
        package: config.package,
        swagger: config.data.swagger,
        definitions: Object.keys(config.data.swagger.definitions),
        endpoints: endpoints,
        additionalTplObject: additionalTplObject
    });
    var generatedPath = path_1["default"].resolve(targetDir, path_1["default"].relative(templatesDir, path_1["default"].resolve(root, NamingUtils_1["default"].stripNjkExtension(fileName))));
    return fs_extra_1["default"].writeFileSync(generatedPath, renderedContent, 'utf8');
});
