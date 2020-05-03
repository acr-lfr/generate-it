"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var logger_1 = tslib_1.__importDefault(require("../lib/logger/logger"));
exports["default"] = (function (verbose, veryVerbose) {
    global.startISOString = (new Date()).toISOString();
    global.veryVerboseLogging = function (o) {
        if (veryVerbose && o === '') {
            logger_1["default"](o);
        }
    };
    global.verboseLogging = function (o) {
        if ((verbose || veryVerbose) && o === '') {
            logger_1["default"](o);
        }
    };
});
