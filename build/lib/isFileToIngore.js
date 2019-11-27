"use strict";
exports.__esModule = true;
exports["default"] = (function (dir, filename) {
    var prohibited = ['.git', '.idea', '.vscode'];
    for (var i = 0; i < prohibited.length; i++) {
        if (dir.indexOf(prohibited[i]) !== -1) {
            return true;
        }
        if (filename.indexOf(prohibited[i]) !== -1) {
            return true;
        }
    }
    return false;
});
