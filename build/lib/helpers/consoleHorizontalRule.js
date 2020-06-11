"use strict";
exports.__esModule = true;
exports["default"] = (function () {
    var hr = '';
    for (var i = 0; i < process.stdout.columns; ++i) {
        hr += '-';
    }
    return hr;
});
