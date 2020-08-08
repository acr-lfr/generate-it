"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ucFirst_1 = tslib_1.__importDefault(require("../template/helpers/ucFirst"));
exports["default"] = (function (fullPath, config) {
    // double check the 1st char is /
    if (fullPath[0] !== '/') {
        fullPath = '/' + fullPath;
    }
    if (fullPath === '/') {
        return 'root';
    }
    if (!config.segmentFirstGrouping) {
        return fullPath.split('/')[1];
    }
    var segmentFirstGrouping = config.segmentFirstGrouping;
    var segments = fullPath.split('/');
    // Get rid of the empty slot
    segments.shift();
    if (segmentFirstGrouping >= segments.length) {
        return fullPath.split('/')[1];
    }
    return segments[0].replace(/{*}*/gm, '')
        + ucFirst_1["default"](segments[segmentFirstGrouping].replace(/{*}*/gm, ''));
});
