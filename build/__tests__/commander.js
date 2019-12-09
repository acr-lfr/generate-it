"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var commander_1 = tslib_1.__importDefault(require("../commander"));
var path_1 = tslib_1.__importDefault(require("path"));
describe('Check all program options are captured and names correctly', function () {
    it('should return all the program options in the returned object', function () {
        var previousArgv = process.argv;
        process.argv = [
            'node',
            'script.js',
            'myfile.yml',
            '-m',
            '-o', 'mydir',
            '-t', 'https://www.mygit.com',
            '--dont-update-tpl-cache',
            '-s', '3',
            '-v',
            '--very-verbose',
        ];
        var cli = commander_1["default"]();
        expect(cli.swaggerFile).toBe(path_1["default"].join(process.cwd(), 'myfile.yml'));
        expect(cli.program.mocked).toBe(true);
        expect(cli.program.output).toBe(path_1["default"].join(process.cwd(), 'mydir'));
        expect(cli.program.template).toBe('https://www.mygit.com');
        expect(cli.program.dontUpdateTplCache).toBe(true);
        expect(cli.program.dontRunComparisonTool).toBe(false);
        expect(cli.program.segmentsCount).toBe('3');
        expect(cli.program.verbose).toBe(true);
        expect(cli.program.veryVerbose).toBe(true);
        process.argv = previousArgv;
    });
    it('should throw an error for no api file passed', function (done) {
        var previousArgv = process.argv;
        try {
            process.argv = [
                'node',
                'script.js',
            ];
            commander_1["default"]();
            process.argv = previousArgv;
            done('Should have thrown an error for no input provided');
        }
        catch (e) {
            process.argv = previousArgv;
            done();
        }
    });
});
