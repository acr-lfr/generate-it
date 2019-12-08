"use strict";
exports.__esModule = true;
exports["default"] = (function (value) {
    var headers = Object.keys(value).filter(function (key) { return key.startsWith('apiKey'); }).map(function (key) {
        return "req.headers['" + value[key].name.toLowerCase() + "']";
    });
    return (headers.length === 0) ? 'false' : headers.join(' || ');
});
