"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var child_process_1 = tslib_1.__importDefault(require("child_process"));
var spawn = child_process_1["default"].spawn;
/**
 * Runs a shell command with given arguments in an array
 * @param {string} program - The string of the command, eg ln
 * @param {array} args - Array of string options to pass to the program eg ['-s', '/file/path/to/link', 'symlink/path']
 * @param {boolean} [verbose] - Default false, when true console logs all output
 * @return {Promise<unknown>}
 */
exports["default"] = (function (program, args, verbose) {
    if (args === void 0) { args = []; }
    if (verbose === void 0) { verbose = false; }
    return new Promise(function (resolve, reject) {
        if (verbose) {
            console.log(program + ' ' + args.join(' '));
        }
        var command = spawn(program, args);
        var outputString = '';
        var outputErrorString = '';
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
                resolve({ outputString: outputString, outputErrorString: outputErrorString });
            }
            else {
                reject({ code: code, outputString: outputString, outputErrorString: outputErrorString });
            }
        });
    });
});
