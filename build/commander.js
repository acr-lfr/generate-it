"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
require("colors");
var commander_1 = tslib_1.__importDefault(require("commander"));
var path_1 = tslib_1.__importDefault(require("path"));
var commanderParseOutput_1 = tslib_1.__importDefault(require("./commanderParseOutput"));
var commanderCollectObject_1 = tslib_1.__importDefault(require("./commanderCollectObject"));
var packageInfo = require('../package.json');
exports["default"] = (function (inputArgsArray) {
    var swaggerFile;
    commander_1["default"]
        .version(packageInfo.version)
        .arguments('<swaggerFile>')
        .action(function (swaggerFilePath) {
        swaggerFile = path_1["default"].resolve(swaggerFilePath);
    })
        .option('-m, --mocked', 'If passed, the domains will be configured to return dummy content.')
        .option('-o, --output <outputDir>', 'directory where to put the rabbitMQ files (defaults to current directory)', commanderParseOutput_1["default"], process.cwd())
        .requiredOption('-t, --template <helpers>', 'Full URL to a public git repo, eg github')
        .option('--dont-update-tpl-cache', 'If the given git url is already cached does not attempt to update', false)
        .option('--dont-run-comparison-tool', 'Skips the stub file comparison tool and version cleanup', false)
        .option('--segment-first-grouping <number>', 'If set will split a domain by group the 1 qty of segments defined in this setting, see endpointNameCalculation.ts')
        .option('--segment-second-grouping <number>', 'Assuming the 1st grouping is set, this will group the 2nd group into another 2 groups, see endpointNameCalculation.ts')
        .option('-$, --variables [value]', 'Array of variables to pass to the templates, eg "-$ httpLibImportStr=@/services/HttpService -$ apikey=321654987"', commanderCollectObject_1["default"], {})
        .option('-v, --verbose', 'Outputs verbose logging')
        .option('--very-verbose', 'Outputs very verbose logging')
        .option('-y, --yes', 'Assumes yes to any questions prompted by the tool. If marked yes we assume you know what you are doing and know the nodegenDir will be rewritten')
        .parse(inputArgsArray);
    if (!swaggerFile) {
        throw new Error('> Path to Swagger file not provided.'.red);
    }
    else {
        return {
            program: commander_1["default"],
            swaggerFile: swaggerFile
        };
    }
});
