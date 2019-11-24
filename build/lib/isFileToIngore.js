"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (dir, filename) => {
    const prohibited = ['.git', '.idea', '.vscode'];
    for (let i = 0; i < prohibited.length; i++) {
        if (dir.indexOf(prohibited[i]) !== -1) {
            return true;
        }
        if (filename.indexOf(prohibited[i]) !== -1) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=isFileToIngore.js.map