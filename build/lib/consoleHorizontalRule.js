"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    let hr = '';
    for (let i = 0; i < process.stdout.columns; ++i) {
        hr += '-';
    }
    console.log(hr);
};
//# sourceMappingURL=consoleHorizontalRule.js.map