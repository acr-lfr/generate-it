"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = tslib_1.__importDefault(require("child_process"));
const spawn = child_process_1.default.spawn;
/**
 * Runs a shell command with given arguments in an array
 * @param {string} program - The string of the command, eg ln
 * @param {array} args - Array of string options to pass to the program eg ['-s', '/file/path/to/link', 'symlink/path']
 * @param {boolean} [verbose] - Default false, when true console logs all output
 * @return {Promise<unknown>}
 */
exports.default = (program, args = [], verbose = false) => {
    return new Promise((resolve, reject) => {
        if (verbose) {
            console.log(program + ' ' + args.join(' '));
        }
        const command = spawn(program, args);
        let outputString = '';
        let outputErrorString = '';
        command.stdout.on('data', function (data) {
            if (verbose && data !== '') {
                console.log(String(data));
            }
            outputString += String(data);
        });
        command.stderr.on('data', function (data) {
            if (verbose && data !== '') {
                console.log(String(data));
            }
            outputErrorString += String(data);
        });
        command.on('close', function (code) {
            if (code === 0) {
                resolve({ outputString, outputErrorString });
            }
            else {
                reject({ code, outputString, outputErrorString });
            }
        });
    });
};
//# sourceMappingURL=commandRun.js.map