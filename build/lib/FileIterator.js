"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
const walk_1 = tslib_1.__importDefault(require("walk"));
const FileTypeCheck_1 = tslib_1.__importDefault(require("./FileTypeCheck"));
const generateFile_1 = tslib_1.__importDefault(require("./generateFile"));
const GenerateInterfaceFiles_1 = tslib_1.__importDefault(require("./GenerateInterfaceFiles"));
const generateOperationFile_1 = tslib_1.__importDefault(require("./generateOperationFile"));
const generateOperationFiles_1 = tslib_1.__importDefault(require("./generateOperationFiles"));
const isFileToIngore_1 = tslib_1.__importDefault(require("./isFileToIngore"));
class FileWalker {
    constructor() {
        this.files = {};
    }
    /**
     * Walks over the file system compiling tpl files with the config data
     * @param {boolean} providedIsFirstRun
     * @param {object} providedConfig
     * @return {Promise<>}
     */
    walk(providedIsFirstRun, providedConfig) {
        this.config = providedConfig;
        this.isFirstRun = providedIsFirstRun;
        const targetDir = this.config.targetDir;
        const templatesDir = this.config.templates;
        fs_extra_1.default.copySync(this.config.swaggerFilePath, path_1.default.resolve(targetDir, 'dredd', 'swagger.yml'));
        return new Promise((resolve, reject) => {
            walk_1.default.walk(templatesDir, {
                followLinks: false,
            }).on('file', this.fileIteration)
                // @ts-ignore
                .on('errors', (root, nodeStatsArray) => {
                reject(nodeStatsArray);
            })
                .on('end', async () => {
                await this.parseOpIndex();
                resolve();
            });
        });
    }
    /**
     * Generates the opIndex tpl file
     * @return {Promise<void>}
     */
    async parseOpIndex() {
        if (this.files[FileTypeCheck_1.default.OPERATION_INDEX]) {
            await generateOperationFile_1.default(this.files[FileTypeCheck_1.default.OPERATION_INDEX].generationDataObject, [], 'index', true, {
                operationFiles: this.files[FileTypeCheck_1.default.OPERATION].files,
            });
        }
    }
    /**
     * The walker function for a single file
     * @param {string} root - The directory to the file
     * @param {string} stats - The name of the file
     * @param {function} next - The callback function to continue
     * @return {Promise<void>}
     */
    async fileIteration(root, stats, next) {
        if (isFileToIngore_1.default(root, stats.name)) {
            return next();
        }
        global.veryVerboseLogging('Dir:' + root);
        global.veryVerboseLogging('File:' + stats.name);
        const targetDir = this.config.targetDir;
        const templatesDir = this.config.templates;
        const templatePath = path_1.default.resolve(targetDir, path_1.default.relative(templatesDir, path_1.default.resolve(root, stats.name)));
        const generationDataObject = {
            root,
            templates_dir: templatesDir,
            targetDir,
            package: this.config.package,
            data: this.config,
            file_name: stats.name,
            segmentsCount: this.config.segmentsCount,
            mockServer: this.config.mockServer,
        };
        const fileType = FileTypeCheck_1.default.getFileType(generationDataObject.file_name);
        if (fileType === FileTypeCheck_1.default.INTERFACE) {
            global.veryVerboseLogging('Interface file: ' + generationDataObject.file_name);
            // iterates over the interfaces array in the swagger object creating multiple interface files
            await (new GenerateInterfaceFiles_1.default(generationDataObject)).writeFiles();
        }
        else if ((this.config.mockServer && fileType === FileTypeCheck_1.default.MOCK) ||
            fileType === FileTypeCheck_1.default.STUB || fileType === FileTypeCheck_1.default.OPERATION) {
            global.veryVerboseLogging('Mock|Stub|Operation file: ' + generationDataObject.file_name);
            // this file should be handled for each in swagger.paths creating multiple path based files, eg domains or routes etc etc
            this.files[fileType] = {
                files: await generateOperationFiles_1.default(generationDataObject),
                generationDataObject,
            };
        }
        else if (fileType === FileTypeCheck_1.default.OPERATION_INDEX) {
            this.files[fileType] = {
                generationDataObject,
            };
        }
        else if (fileType === FileTypeCheck_1.default.OTHER) {
            // standard tpl file, no iterations, simple parse with the generationDataObject
            await generateFile_1.default(generationDataObject, this.isFirstRun);
        }
        if (templatePath.substr(templatePath.length - 3) === 'njk') {
            fs_extra_1.default.removeSync(templatePath);
        }
        global.veryVerboseLogging(root);
        next();
    }
}
exports.default = new FileWalker();
