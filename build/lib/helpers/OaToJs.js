"use strict";
exports.__esModule = true;
var OaToJs = /** @class */ (function () {
    function OaToJs() {
    }
    OaToJs.prototype.oaToJsType = function (input, from) {
        if (!input.type && input.properties) {
            input.type = 'object';
        }
        switch (input.type) {
            case 'string':
                return String;
            case 'integer':
                return Number;
            case 'number':
                return Number;
            case 'boolean':
                return Boolean;
            case 'array':
                if (!input.items) {
                    return Array;
                }
                else {
                    return [this.oaToJsType(input.items)];
                }
            case 'array-interface':
                if (!input.items) {
                    return Array;
                }
                else {
                    return [this.oaToJsType(input.items)];
                }
            case 'object':
                if (!input.properties) {
                    return Object;
                }
                else {
                    return this.objectWalk(input.properties);
                }
        }
    };
    OaToJs.prototype.objectWalk = function (input) {
        for (var key in input) {
            if (input[key].type) {
                input[key] = this.oaToJsType(input[key], key);
            }
            else if (typeof input[key] !== 'function') {
                delete input[key];
            }
        }
        return input;
    };
    return OaToJs;
}());
exports["default"] = new OaToJs();
