"use strict";
exports.__esModule = true;
exports["default"] = (function (input) {
    if (input['200']) {
        if (input['200'].schema) {
            // we are oa2
            return input['200'].schema;
        }
        else {
            // we are oa3
            if (input['200'].content && input['200'].content['application/json']) {
                if (input['200'].content['application/json'].schema) {
                    return input['200'].content['application/json'].schema;
                }
            }
        }
    }
    // We also check if the input contains any valid OA schema by looking for type or properties in the provided object
    // The typical use case here if for async api payloads
    return (input && (input.type || input.properties)) ? input : {};
});
