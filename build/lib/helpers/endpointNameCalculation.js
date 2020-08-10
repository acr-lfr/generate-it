"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ucFirst_1 = tslib_1.__importDefault(require("../template/helpers/ucFirst"));
exports["default"] = (function (fullPath, config) {
    var segmentFirstGrouping = config.segmentFirstGrouping, segmentSecondGrouping = config.segmentSecondGrouping;
    if (segmentFirstGrouping === undefined && segmentSecondGrouping !== undefined) {
        throw new Error('You must provide segmentFirstGrouping when providing segmentSecondGrouping. segmentSecondGrouping found but segmentFirstGrouping is undefined');
    }
    if (segmentFirstGrouping !== undefined && segmentSecondGrouping !== undefined) {
        if (segmentFirstGrouping >= segmentSecondGrouping) {
            throw new Error('When setting the segmentSecondGrouping it must be greater that the segmentFirstGrouping');
        }
    }
    // double check the 1st char is /
    if (fullPath[0] !== '/') {
        fullPath = '/' + fullPath;
    }
    if (fullPath === '/') {
        return 'root';
    }
    if (segmentFirstGrouping === undefined || segmentFirstGrouping === 0 && !segmentSecondGrouping) {
        return fullPath.split('/')[1];
    }
    var segments = fullPath.split('/');
    // Get rid of the empty slot
    segments.shift();
    if (segmentFirstGrouping >= segments.length) {
        return fullPath.split('/')[1];
    }
    if (!segmentSecondGrouping || segmentSecondGrouping && segmentSecondGrouping >= segments.length) {
        return segments[0].replace(/{*}*/gm, '')
            + ucFirst_1["default"](segments[segmentFirstGrouping].replace(/{*}*/gm, ''));
    }
    if (segmentFirstGrouping === 0) {
        return segments[0].replace(/{*}*/gm, '')
            + ucFirst_1["default"](segments[segmentSecondGrouping].replace(/{*}*/gm, ''));
    }
    return segments[0].replace(/{*}*/gm, '')
        + ucFirst_1["default"](segments[segmentFirstGrouping].replace(/{*}*/gm, ''))
        + ucFirst_1["default"](segments[segmentSecondGrouping].replace(/{*}*/gm, ''));
});
