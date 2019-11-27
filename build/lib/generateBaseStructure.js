"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var deepmerge_1 = tslib_1.__importDefault(require("deepmerge"));
var fs = tslib_1.__importStar(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
/**
 * Creates the base structure
 * @param targetDir
 * @param templatesDir
 * @param additionalOptionsToInject
 * @return void
 */
exports["default"] = (function (targetDir, templatesDir, additionalOptionsToInject) {
    additionalOptionsToInject = additionalOptionsToInject || {};
    fs.mkdirsSync(targetDir);
    var callerPackageJsonPath = path_1["default"].join(targetDir, 'package.json');
    var packageJsonFound = (fs.existsSync(callerPackageJsonPath));
    fs.copySync(templatesDir, targetDir, {
        filter: function (src) {
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
        }
    });
    if (packageJsonFound) {
        // merge the package json files together
        var callerPackageJson = fs.readJsonSync(callerPackageJsonPath);
        var templatePackageJson = JSON.parse(fs.readFileSync(path_1["default"].join(templatesDir, 'package.json.njk'), 'utf8'));
        var merged = Object.assign(deepmerge_1["default"](callerPackageJson, templatePackageJson), additionalOptionsToInject);
        fs.writeJsonSync(callerPackageJsonPath, merged, {
            spaces: 2
        });
    }
});
