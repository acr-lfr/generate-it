"use strict";
exports.__esModule = true;
exports["default"] = (function (pathName, operationName) {
    var subResource = pathName.substring(operationName.length + 1) || '/';
    return subResource.replace(/}/g, '').replace(/{/g, ':');
});
