"use strict";
exports.__esModule = true;
exports["default"] = (function (val, obj) {
    var parts = val.split('=');
    if (parts.length === 1) {
        obj[String(parts[0].trim())] = true;
    }
    else {
        obj[String(parts.shift().trim())] = parts.join().trim();
    }
    return obj;
});
