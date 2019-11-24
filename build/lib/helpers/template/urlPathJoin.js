"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
function default_1() {
    let returnString = '';
    for (const arg in arguments) {
        if (arguments.hasOwnProperty(arg)) {
            returnString += _.trim(arguments[arg], '/');
        }
    }
    return returnString;
}
exports.default = default_1;
//# sourceMappingURL=urlPathJoin.js.map