"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NamingUtils_1 = tslib_1.__importDefault(require("../NamingUtils"));
it('Return as is if provided argument does not contain -', () => {
    expect(NamingUtils_1.default.fixRouteName('helloworld')).toBe('helloworld');
});
it('Return camelcase from snake case', () => {
    expect(NamingUtils_1.default.fixRouteName('hello-world')).toBe('helloWorld');
});
it('Return camelcase from multi snake case', () => {
    expect(NamingUtils_1.default.fixRouteName('hello-world-today-now')).toBe('helloWorldTodayNow');
});
//# sourceMappingURL=namingUtils.fixRouteName.js.map