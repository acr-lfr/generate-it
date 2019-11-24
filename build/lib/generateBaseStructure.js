"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deepmerge_1 = tslib_1.__importDefault(require("deepmerge"));
const fs = tslib_1.__importStar(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
/**
 * Creates the base structure
 * @param targetDir
 * @param templatesDir
 * @param additionalOptionsToInject
 * @return void
 */
exports.default = (targetDir, templatesDir, additionalOptionsToInject) => {
    additionalOptionsToInject = additionalOptionsToInject || {};
    fs.mkdirsSync(targetDir);
    const callerPackageJsonPath = path_1.default.join(targetDir, 'package.json');
    const packageJsonFound = (fs.existsSync(callerPackageJsonPath));
    fs.copySync(templatesDir, targetDir, {
        filter: (src) => {
            if (src.indexOf('__mocks__') !== -1 && !additionalOptionsToInject.mockingServer) {
                return false;
            }
            if (src.indexOf('.git') !== -1) {
                return false;
            }
            if (packageJsonFound) {
                if (src.indexOf('package.json') !== -1) {
                    return false;
                }
            }
            return true;
        },
    });
    if (packageJsonFound) {
        // merge the package json files together
        const callerPackageJson = fs.readJsonSync(callerPackageJsonPath);
        const templatePackageJson = JSON.parse(fs.readFileSync(path_1.default.join(templatesDir, 'package.json.njk'), 'utf8'));
        const merged = Object.assign(deepmerge_1.default(callerPackageJson, templatePackageJson), additionalOptionsToInject);
        fs.writeJsonSync(callerPackageJsonPath, merged, {
            spaces: 2,
        });
    }
};
