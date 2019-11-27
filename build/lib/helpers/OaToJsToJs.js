"use strict";
exports.__esModule = true;
var OaToJsToJs = /** @class */ (function () {
    function OaToJsToJs() {
    }
    OaToJsToJs.prototype.getType = function (leaf) {
        if (leaf === Object) {
            return 'Object';
        }
        else if (leaf === Array) {
            return 'Array';
        }
        else if (leaf === String) {
            return 'String';
        }
        else if (leaf === Number) {
            return 'Number';
        }
        else if (leaf === Boolean) {
            return 'Boolean';
        }
    };
    OaToJsToJs.prototype.arrayWalkWrite = function (input, builtString) {
        builtString = builtString || ' ';
        for (var i = 0; i < input.length; ++i) {
            if (typeof input[i] === 'function') {
                builtString += this.getType(input[i]) + ', ';
            }
            else if (Array.isArray(input[i])) {
                builtString += '[' + this.arrayWalkWrite(input[i]) + '],';
            }
            else if (typeof input[i] === 'object') {
                builtString += '{' + this.objectWalkWrite(input[i], builtString) + '}';
            }
        }
        return builtString.substring(0, builtString.length - 2);
    };
    OaToJsToJs.prototype.objectWalkWrite = function (input, builtString) {
        builtString = builtString || '{';
        for (var key in input) {
            if (typeof input[key] === 'function') {
                builtString += key + ': ' + this.getType(input[key]) + ", ";
            }
            else if (Array.isArray(input[key])) {
                builtString += key + ': [' + this.arrayWalkWrite(input[key]) + '],';
            }
            else if (typeof input[key] === 'object') {
                builtString += key + ': ' + this.objectWalkWrite(input[key]);
            }
        }
        builtString += '},';
        return builtString;
    };
    return OaToJsToJs;
}());
exports["default"] = new OaToJsToJs();
