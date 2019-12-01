"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var generateOperationId_1 = tslib_1.__importDefault(require("../generateOperationId"));
it('handle a simple path', function () {
    expect(generateOperationId_1["default"]('get', 'some/path')).toBe('somePathGet');
});
it('handle a path with a path param', function () {
    expect(generateOperationId_1["default"]('get', 'some/{id}/path')).toBe('someIdPathGet');
});
it('handle a root', function () {
    expect(generateOperationId_1["default"]('get', '/')).toBe('get');
});
