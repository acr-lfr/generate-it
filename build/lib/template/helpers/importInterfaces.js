"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var isValidMethod_1 = tslib_1.__importDefault(require("./isValidMethod"));
/**
 *
 * @param operations - Array of operations from generate/GenerateOperation.ts
 * @param [actions] - An optional array of actions to include, eg "get" or "post or "subscribe" or "publish" or any other channel/http method
 */
function default_1(operations, actions) {
    try {
        var imports_1 = [];
        operations.forEach(function (operation) {
            var operationType = operation.path ? 'path' : 'channel';
            Object.keys(operation[operationType]).forEach(function (pathKey) {
                var path = operation[operationType][pathKey];
                if (operationType === 'channel') {
                    if (!actions ||
                        (actions && actions.length === 0) ||
                        (actions && actions.length > 0 && actions.includes(pathKey))) {
                        if (typeof path['x-request-definitions'] === 'string') {
                            imports_1.push(path['x-request-definitions']);
                        }
                        if (typeof path['x-response-definitions'] === 'string') {
                            imports_1.push(path['x-response-definitions']);
                        }
                    }
                }
                else {
                    if (isValidMethod_1["default"](pathKey)) {
                        // Inject the request parameter interfaces
                        ['query', 'path', 'body', 'header', 'formData'].forEach(function (requestType) {
                            if (path['x-request-definitions'][requestType]) {
                                if (path['x-request-definitions'][requestType].interfaceName) {
                                    if (imports_1.indexOf(path['x-request-definitions'][requestType].interfaceName) === -1) {
                                        imports_1.push(path['x-request-definitions'][requestType].interfaceName);
                                    }
                                }
                                if (requestType === 'body') {
                                    imports_1.push(path['x-request-definitions'][requestType].params[0].name);
                                }
                                else {
                                    if (path['x-request-definitions'][requestType].name) {
                                        if (imports_1.indexOf(path['x-request-definitions'][requestType].name) === -1) {
                                            imports_1.push(path['x-request-definitions'][requestType].name);
                                        }
                                    }
                                }
                            }
                        });
                        // Inject the response interfaces
                        if (path['x-response-definitions']) {
                            for (var statusCode in path['x-response-definitions']) {
                                if (imports_1.indexOf(path['x-response-definitions'][statusCode]) === -1) {
                                    imports_1.push(path['x-response-definitions'][statusCode]);
                                }
                            }
                        }
                    }
                }
            });
        });
        imports_1.sort();
        return (new Set(imports_1)).keys();
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}
exports["default"] = default_1;
