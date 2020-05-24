"use strict";
exports.__esModule = true;
exports.semverCompare = void 0;
exports.semverCompare = function (versionA, versionB) {
    var _a = (versionA || '')
        .replace(/\+.*/, '')
        .split('-')
        .map(function (s) { return s.split('.'); }), coreA = _a[0], preA = _a[1];
    var _b = (versionB || '')
        .replace(/\+.*/, '')
        .split('-')
        .map(function (s) { return s.split('.'); }), coreB = _b[0], preB = _b[1];
    var coreCmp = function (a1, b1) {
        if (Number.isNaN(Number(a1)) || Number.isNaN(Number(b1))) {
            return 0;
        }
        return +a1 - +b1;
    };
    var preCmp = function (a1, b1) {
        if (!Number.isNaN(Number(a1)) && !Number.isNaN(Number(b1))) {
            return +a1 - +b1;
        }
        return a1.localeCompare(b1);
    };
    for (var i = 0; i < coreA.length; ++i) {
        var n = coreCmp(coreA[i], coreB[i]);
        if (n)
            return n;
    }
    if (preB && !preA)
        return 1;
    if (preA && !preB)
        return -1;
    for (var i = 0; i < (preA || []).length; ++i) {
        if (preB.length === i)
            return 1;
        if (preA[i] === preB[i])
            continue;
        var n = preCmp(preA[i], preB[i]);
        if (n)
            return n;
    }
    return -1;
};
exports["default"] = exports.semverCompare;
