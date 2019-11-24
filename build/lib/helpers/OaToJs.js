"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OaToJs {
    oaToJsType(input, from) {
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
    }
    objectWalk(input) {
        for (const key in input) {
            if (input[key].type) {
                input[key] = this.oaToJsType(input[key], key);
            }
            else if (typeof input[key] !== 'function') {
                delete input[key];
            }
        }
        return input;
    }
}
exports.default = new OaToJs();
//# sourceMappingURL=OaToJs.js.map