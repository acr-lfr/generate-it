"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextFileDiff = require('text-file-diff');
/**
 * Compares the diff between 2 file chunks
 * @param {string} oldTextFile - Old text filepath to compare
 * @param {string} newTextFile - New text filepath to compare
 * @return {Promise<{minus: *, difference: *, plus: *}>}
 */
exports.default = async (oldTextFile = '', newTextFile = '') => {
    const m = new TextFileDiff();
    let difference = '';
    let minus = 0;
    let plus = 0;
    m.on('-', (line, obj) => {
        ++minus;
        const diffLine = `
@line: ` + obj.lineNumber + `-
` + line;
        difference += diffLine.red;
    });
    m.on('+', (line, obj) => {
        ++plus;
        const diffLine = `
@line: ` + obj.lineNumber + `+
` + line;
        difference += diffLine.green;
    });
    m.diff(oldTextFile, newTextFile);
    return {
        minus,
        plus,
        difference,
    };
};
