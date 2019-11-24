"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OaToJsToJs {
    getType(leaf) {
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
    }
    arrayWalkWrite(input, builtString) {
        builtString = builtString || ' ';
        for (let i = 0; i < input.length; ++i) {
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
    }
    objectWalkWrite(input, builtString) {
        builtString = builtString || '{';
        for (const key in input) {
            if (typeof input[key] === 'function') {
                builtString += key + ': ' + this.getType(input[key]) + `, `;
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
    }
}
exports.default = new OaToJsToJs();
//# sourceMappingURL=OaToJsToJs.js.map