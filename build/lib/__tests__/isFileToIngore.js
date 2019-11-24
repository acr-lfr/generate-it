"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const isFileToIngore_1 = tslib_1.__importDefault(require("../isFileToIngore"));
describe('Should no allow directories on black list, eg git idea vscode, even as a file', () => {
    it('should no allow git paths', () => {
        expect(isFileToIngore_1.default('som/dir/.git', 'config')).toBe(true);
    });
    it('should no allow idea paths', () => {
        expect(isFileToIngore_1.default('som/dir/.idea', 'workspace')).toBe(true);
    });
    it('should no allow vscode paths', () => {
        expect(isFileToIngore_1.default('som/dir/.vscode', 'workspace')).toBe(true);
    });
    it('should no allow vscode paths', () => {
        expect(isFileToIngore_1.default('som/dir/vscode', '.vscode')).toBe(true);
    });
});
describe('Should other directories in and .njk files', () => {
    it('should allow http paths', () => {
        expect(isFileToIngore_1.default('som/dir/http', 'config')).toBe(false);
    });
    it('should allow http paths', () => {
        expect(isFileToIngore_1.default('som/dir/http', '___op.njk')).toBe(false);
    });
});
//# sourceMappingURL=isFileToIngore.js.map