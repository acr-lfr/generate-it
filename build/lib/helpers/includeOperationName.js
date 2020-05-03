"use strict";
exports.__esModule = true;
exports["default"] = (function (operationName, nodegenRc) {
    if (!nodegenRc.helpers || !nodegenRc.helpers.operationNames) {
        return true;
    }
    if (nodegenRc.helpers.operationNames.include &&
        nodegenRc.helpers.operationNames.include.includes(operationName)) {
        return true;
    }
    if (nodegenRc.helpers.operationNames.include &&
        !nodegenRc.helpers.operationNames.include.includes(operationName)) {
        return false;
    }
    if (nodegenRc.helpers.operationNames.exclude &&
        !nodegenRc.helpers.operationNames.exclude.includes(operationName)) {
        return true;
    }
    if (nodegenRc.helpers.operationNames.exclude &&
        nodegenRc.helpers.operationNames.exclude.includes(operationName)) {
        return false;
    }
});
