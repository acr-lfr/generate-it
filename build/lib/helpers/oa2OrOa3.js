"use strict";
exports.__esModule = true;
exports["default"] = (function (param) {
    if (param.type) {
        var assign = {};
        assign[param.name] = {
            type: param.type
        };
        return assign;
    }
    else {
        return param.schema;
    }
});
