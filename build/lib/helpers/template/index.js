"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const _ = tslib_1.__importStar(require("lodash"));
const path_1 = tslib_1.__importDefault(require("path"));
const files = fs_extra_1.default.readdirSync(__dirname);
const object = {};
files.forEach((file) => {
    if (!file.includes('__tests__') && !files.includes('index.ts')) {
        object[path_1.default.basename(file, '.ts')] = require(path_1.default.join(__dirname, file));
    }
});
for (const key in _) {
    if (_.hasOwnProperty(key)) {
        // @ts-ignore
        object[key] = _[key];
    }
}
exports.default = object;
