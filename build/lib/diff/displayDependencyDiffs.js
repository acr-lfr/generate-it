"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
require("colors");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
exports["default"] = (function (targetDir, templatesDir) {
    var packagJsonStr = 'package.json';
    var existing = JSON.parse(fs_extra_1["default"].readFileSync(path_1["default"].join(targetDir, packagJsonStr), { encoding: 'utf8' }));
    var newJson = JSON.parse(fs_extra_1["default"].readFileSync(path_1["default"].join(templatesDir, packagJsonStr + '.njk'), 'utf8'));
    var scriptsChanged = {};
    var dependenciesChanged = {};
    var devDependenciesChanged = {};
    var buildDiff = function (changed, from) {
        this['Changed To'] = changed;
        this.from = from || 'Not present on existing package.json, please add.';
    };
    if (newJson.scripts) {
        Object.keys(newJson.scripts).forEach(function (key) {
            if (!existing.scripts[key] || existing.scripts[key] !== newJson.scripts[key]) {
                // @ts-ignore
                scriptsChanged[key] = new buildDiff(newJson.scripts[key], existing.scripts[key]);
            }
        });
    }
    if (newJson.dependencies) {
        Object.keys(newJson.dependencies).forEach(function (key) {
            if (!existing.dependencies[key] || existing.dependencies[key] !== newJson.dependencies[key]) {
                // @ts-ignore
                dependenciesChanged[key] = new buildDiff(newJson.dependencies[key], existing.dependencies[key]);
            }
        });
    }
    if (newJson.devDependencies) {
        Object.keys(newJson.devDependencies).forEach(function (key) {
            if (!existing.devDependencies[key] || existing.devDependencies[key] !== newJson.devDependencies[key]) {
                // @ts-ignore
                devDependenciesChanged[key] = new buildDiff(newJson.devDependencies[key], existing.devDependencies[key]);
            }
        });
    }
    if (Object.keys(scriptsChanged).length > 1) {
        console.log('Please check your package json scripts are up to date, the tpl and local scripts differ:'.green);
        console.table(scriptsChanged);
    }
    var buildQuickFix = function (deps) {
        if (!deps)
            return;
        var commandParts = Object.entries(deps).reduce(function (installCmd, _a) {
            var pkgName = _a[0], diff = _a[1];
            var version = diff['Changed To'].replace(/[^0-9.]/, '');
            return installCmd.concat(pkgName + "@" + version);
        }, ['npm install']);
        return commandParts.join(' ');
    };
    if (Object.keys(dependenciesChanged).length > 1) {
        console.log('Please check your package json PROD dependencies are up to date, the tpl and local scripts differ:'.green);
        console.table(dependenciesChanged);
        console.log("Quick fix: \n" + buildQuickFix(dependenciesChanged) + "\n");
    }
    if (Object.keys(devDependenciesChanged).length > 1) {
        console.log('Please check your package json DEV dependencies are up to date, the tpl and local scripts differ:'.green);
        console.table(devDependenciesChanged);
        console.log("Quick fix: \n" + buildQuickFix(devDependenciesChanged) + "\n");
    }
});
