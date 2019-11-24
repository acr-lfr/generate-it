"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
/**
 *
 * @param {string} targetDir
 * @param {string} templatesDir
 * @param {boolean} mocked
 * @param nodegenRc
 */
exports.default = (targetDir, templatesDir, mocked = false, nodegenRc) => {
    const nodeGenDir = nodegenRc.nodegenDir;
    const copyFilter = {
        filter: (src) => {
            // ensure the njk files are not copied over
            return (src.indexOf('.njk') === -1);
        },
    };
    fs.removeSync(path_1.default.join(targetDir, nodeGenDir));
    fs.copySync(path_1.default.join(templatesDir, nodeGenDir), path_1.default.join(targetDir, nodeGenDir), copyFilter);
    if (mocked) {
        const mocksDir = nodegenRc.nodegenMockDir;
        fs.removeSync(path_1.default.join(targetDir, mocksDir));
        fs.copySync(path_1.default.join(templatesDir, mocksDir), path_1.default.join(targetDir, mocksDir), copyFilter);
    }
};
//# sourceMappingURL=resetNodegenFolder.js.map