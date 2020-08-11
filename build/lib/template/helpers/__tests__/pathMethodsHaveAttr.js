"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var pathMethodsHaveAttr_1 = tslib_1.__importDefault(require("../pathMethodsHaveAttr"));
it('should return undefined', function () {
    var operations = [{
            path: {
                post: {
                    'security': [{ apiKey: '' }]
                }
            }
        }];
    expect(pathMethodsHaveAttr_1["default"](operations, 'security')).toBe(true);
});
it('should return undefined', function () {
    var operations = [{
            path: {
                post: {
                    'security': [{ apiKey: '' }]
                }
            }
        }];
    expect(pathMethodsHaveAttr_1["default"](operations, 'security', 'jwtToken')).toBe(false);
});
it('should return true', function () {
    var operations = [{
            path: {
                post: {
                    'security': [{ apiKey: '' }]
                },
                put: {
                    'security': [{ jwtToken: '' }]
                }
            }
        }];
    expect(pathMethodsHaveAttr_1["default"](operations, 'security', 'jwtToken')).toBe(true);
});
it('should return false', function () {
    var operations = [{
            path: {
                post: {
                    'security': [{ apiKey: '' }]
                }
            }
        }, {
            path: {
                patch: {
                    'security': [{ apiKey: '' }]
                }
            }
        }];
    expect(pathMethodsHaveAttr_1["default"](operations, 'security', 'jwtToken')).toBe(false);
});
it('should return true', function () {
    var operations = [{
            path: {
                post: {
                    'security': [{ apiKey: '' }]
                }
            }
        }, {
            path: {
                post: {
                    'security': [{ jwtToken: '' }]
                }
            }
        }];
    expect(pathMethodsHaveAttr_1["default"](operations, 'security', 'jwtToken')).toBe(true);
});
it('should return true', function () {
    var operations = [{
            path: {
                post: {
                    parameters: [{
                            'x-nested': {
                                required: true
                            }
                        }]
                }
            }
        }];
    expect(pathMethodsHaveAttr_1["default"](operations, 'parameters', 'x-nested.required')).toBe(true);
});
