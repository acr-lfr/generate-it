"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("colors");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
exports.default = (targetDir, templatesDir) => {
    const packagJsonStr = 'package.json';
    const existing = JSON.parse(fs_extra_1.default.readFileSync(path_1.default.join(targetDir, packagJsonStr), { encoding: 'utf8' }));
    const newJson = JSON.parse(fs_extra_1.default.readFileSync(path_1.default.join(templatesDir, packagJsonStr + '.njk'), 'utf8'));
    const scriptsChanged = {};
    const dependenciesChanged = {};
    const devDependenciesChanged = {};
    const buildDiff = function (changed, from) {
        this['Changed To'] = changed;
        this.from = from || 'Not present on existing package.json, please add.';
    };
    if (newJson.scripts) {
        Object.keys(newJson.scripts).forEach((key) => {
            if (!existing.scripts[key] || existing.scripts[key] !== newJson.scripts[key]) {
                // @ts-ignore
                scriptsChanged[key] = new buildDiff(newJson.scripts[key], existing.scripts[key]);
            }
        });
    }
    if (newJson.dependencies) {
        Object.keys(newJson.dependencies).forEach((key) => {
            if (!existing.dependencies[key] || existing.dependencies[key] !== newJson.dependencies[key]) {
                // @ts-ignore
                dependenciesChanged[key] = new buildDiff(newJson.dependencies[key], existing.dependencies[key]);
            }
        });
    }
    if (newJson.devDependencies) {
        Object.keys(newJson.devDependencies).forEach((key) => {
            if (!existing.devDependencies[key] || existing.devDependencies[key] !== newJson.devDependencies[key]) {
                // @ts-ignore
                devDependenciesChanged[key] = new buildDiff(newJson.devDependencies[key], existing.devDependencies[key]);
            }
        });
    }
    if (Object.keys(scriptsChanged).length > 1) {
        console.log('The following package.json scripts have been updated:'.green);
        console.table(scriptsChanged);
    }
    if (Object.keys(dependenciesChanged).length > 1) {
        console.log('The following package.json dependencies have been updated:'.green);
        console.table(dependenciesChanged);
    }
    if (Object.keys(devDependenciesChanged).length > 1) {
        console.log('The following package.json devDependencies have been updated:'.green);
        console.table(devDependenciesChanged);
    }
};
//# sourceMappingURL=displayDependencyDiffs.js.map