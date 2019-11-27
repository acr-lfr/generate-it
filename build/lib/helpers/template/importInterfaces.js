"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var isValidMethod_1 = tslib_1.__importDefault(require("./isValidMethod"));
function default_1(operations) {
    var imports = [];
    Object.keys(operations).forEach(function (operationKey) {
        var operation = operations[operationKey];
        Object.keys(operation.path).forEach(function (pathKey) {
            var path = operation.path[pathKey];
            if (isValidMethod_1["default"](pathKey)) {
                // Inject the request parameter interfaces
                ['query', 'path', 'body', 'headers', 'formData'].forEach(function (requestType) {
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
                    for (var statusCode in path['x-response-definitions']) {
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
exports["default"] = default_1;
