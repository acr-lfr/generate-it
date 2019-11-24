"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const isValidMethod_1 = tslib_1.__importDefault(require("./isValidMethod"));
function default_1(operations) {
    const imports = [];
    Object.keys(operations).forEach((operationKey) => {
        const operation = operations[operationKey];
        Object.keys(operation.path).forEach((pathKey) => {
            const path = operation.path[pathKey];
            if (isValidMethod_1.default(pathKey)) {
                // Inject the request parameter interfaces
                ['query', 'path', 'body', 'headers', 'formData'].forEach((requestType) => {
                    if (path['x-request-definitions'][requestType]) {
                        if (path['x-request-definitions'][requestType].interfaceName) {
                            if (imports.indexOf(path['x-request-definitions'][requestType].interfaceName) === -1) {
                                imports.push(path['x-request-definitions'][requestType].interfaceName);
                            }
                        }
                        if (path['x-request-definitions'][requestType].name) {
                            if (imports.indexOf(path['x-request-definitions'][requestType].name) === -1) {
                                imports.push(path['x-request-definitions'][requestType].name);
                            }
                        }
                    }
                });
                // Inject the response interfaces
                if (path['x-response-definitions']) {
                    for (const statusCode in path['x-response-definitions']) {
                        if (imports.indexOf(path['x-response-definitions'][statusCode]) === -1) {
                            imports.push(path['x-response-definitions'][statusCode]);
                        }
                    }
                }
            }
        });
    });
    imports.sort();
    return imports;
}
exports.default = default_1;
