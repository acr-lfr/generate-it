"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("colors");
const fs = tslib_1.__importStar(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
const ConfigMerger_1 = tslib_1.__importDefault(require("./ConfigMerger"));
const FileIterator_1 = tslib_1.__importDefault(require("./FileIterator"));
const GeneratedComparison_1 = tslib_1.__importDefault(require("./GeneratedComparison"));
const generateDirectoryStructure_1 = tslib_1.__importDefault(require("./generateDirectoryStructure"));
const OpenApiToObject_1 = tslib_1.__importDefault(require("./OpenApiToObject"));
const TemplateFetch_1 = tslib_1.__importDefault(require("./TemplateFetch"));
/**
 * Generates a code skeleton for an API given an OpenAPI/Swagger file.
 *
 * @module codegen.generate
 * @param  {Object} config Configuration options
 * @param  {String} config.swaggerFilePath - OpenAPI file path
 * @param  {String} config.targetDir Path to the directory where the files will be generated.
 * @param  {String} config.template - Templates to use, es6 or typescript
 * @param  {String} config.handlebars_helper - Additional custom helper files to loads
 * @param  {Boolean} config.mockServer - Dictates if mocker server is generated or not, this overwrites all files in target
 * @param  {Boolean} config.verbose - Verbose logging on or off
 * @return {Promise}
 */
exports.default = async (config) => {
    console.log('Preparing templates...'.green.bold);
    const templatesDir = await TemplateFetch_1.default.resolveTemplateType(config.template);
    let extendedConfig = await ConfigMerger_1.default.base(config, templatesDir);
    console.log('Preparing openapi object...'.green.bold);
    const apiObject = await (new OpenApiToObject_1.default(extendedConfig)).build();
    const baseCompiledObjectPath = path_1.default.join(GeneratedComparison_1.default.getCacheBaseDir(config.targetDir), 'apiObject.json');
    console.log(`Printing full object to: ${baseCompiledObjectPath}`.green.bold);
    fs.ensureFileSync(baseCompiledObjectPath);
    fs.writeJsonSync(baseCompiledObjectPath, apiObject, { spaces: 2 });
    extendedConfig = ConfigMerger_1.default.injectSwagger(apiObject, apiObject);
    console.log('Injecting content to files...'.green.bold);
    await FileIterator_1.default.walk(generateDirectoryStructure_1.default(extendedConfig, templatesDir), extendedConfig);
    console.log('Building stub file comparison list...'.green.bold);
    const diffObject = await GeneratedComparison_1.default.fileDiffs(config.targetDir);
    await GeneratedComparison_1.default.fileDiffsPrint(config.targetDir, diffObject);
    console.log('Comparison version cleanup...'.green.bold);
    GeneratedComparison_1.default.versionCleanup(config.targetDir);
};
//# sourceMappingURL=index.js.map