"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var NamingUtils_1 = tslib_1.__importDefault(require("../NamingUtils"));
it('Return as is if provided argument does not contain -', function () {
    expect(NamingUtils_1["default"].fixRouteName('helloworld')).toBe('helloworld');
});
it('Return camelcase from snake case', function () {
    expect(NamingUtils_1["default"].fixRouteName('hello-world')).toBe('helloWorld');
});
it('Return camelcase from multi snake case', function () {
    expect(NamingUtils_1["default"].fixRouteName('hello-world-today-now')).toBe('helloWorldTodayNow');
});
