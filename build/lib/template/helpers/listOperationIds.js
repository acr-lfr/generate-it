"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
/**
 *
 * @param inputString to ucfirst
 * @returns {string}
 */
var extractAllUniqueIds_1 = tslib_1.__importDefault(require("@/utils/extractAllUniqueIds"));
exports["default"] = (function (fullYamlObject) {
    return extractAllUniqueIds_1["default"](fullYamlObject);
});
