"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const displayDependencyDiffs_1 = tslib_1.__importDefault(require("./displayDependencyDiffs"));
const generateBaseStructure_1 = tslib_1.__importDefault(require("./generateBaseStructure"));
const resetNodegenFolder_1 = tslib_1.__importDefault(require("./resetNodegenFolder"));
require("colors");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
/**
 * Generates the directory structure.
 * @param  {Object}        config - Configuration options
 * @param  {Object|String} config.swagger - Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.targetDir - Absolute path to the directory where the files will be generated.
 * @param  {String}        config.templates - Absolute path to the templates that should be used.
 * @param  {Object}        config.nodegenRc - Absolute path to the templates that should be used.
 * @param  {String}        templatesDir - The absolute path the templates directory
 * @return {boolean}
 */
exports.default = (config, templatesDir) => {
    const targetDir = config.targetDir;
    let IS_FIRST_RUN = false;
    if (!fs_extra_1.default.existsSync(path_1.default.join(targetDir, config.nodegenRc.nodegenDir))) {
        IS_FIRST_RUN = true;
        generateBaseStructure_1.default(targetDir, templatesDir, (config.mockServer) ? { mockingServer: true } : {});
    }
    else {
        resetNodegenFolder_1.default(targetDir, templatesDir, config.mockServer, config.nodegenRc);
        displayDependencyDiffs_1.default(targetDir, templatesDir);
    }
    return IS_FIRST_RUN;
};
//# sourceMappingURL=generateDirectoryStructure.js.map