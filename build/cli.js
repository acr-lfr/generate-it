#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
require("colors");
var inquirer = tslib_1.__importStar(require("inquirer"));
var path_1 = tslib_1.__importDefault(require("path"));
var commander_1 = tslib_1.__importDefault(require("./commander"));
var openapiNodegen_1 = tslib_1.__importDefault(require("./openapiNodegen"));
var cli_1 = require("./constants/cli");
var cli = commander_1["default"]();
console.log(("Provided arguments look ok, preceding to build the http layer and any stub files " + cli_1.LINEBREAK).yellow);
var config = {
    verbose: cli.program.verbose || false,
    veryVerbose: cli.program.veryVerbose || false,
    dontUpdateTplCache: cli.program.dontUpdateTplCache,
    swaggerFilePath: cli.swaggerFile,
    targetDir: cli.program.output,
    template: cli.program.template,
    segmentsCount: cli.program.segmentsCount,
    handlebars_helper: cli.program.handlebars ? path_1["default"].resolve(process.cwd(), cli.program.handlebars) : undefined,
    ignoredModules: cli.program.ignoredModules ? cli.program.ignoredModules.split(',') : [],
    mockServer: cli.program.mocked || false
};
var question = "Continuing will replace the entire http layer:".green + "\n- ___interface|mock|op files are classed as the http layer and will be regenerated based on the provide api file, meaning local changes to these files will be lost.\n- Differences in the ___stub files, new|removed|changed methods (typically the domain layer) will be output to the console.\n- See the manual for further information: https://acrontum.github.io/openapi-nodegen/\n- This message is of no concern for a 1st time run." + "\n\nAre you sure you wish to continue?\n".green;
var questions = [{
        type: 'confirm',
        name: 'installConfirm',
        message: question,
        "default": false
    }];
inquirer.prompt(questions)
    .then(function (answers) {
    if (answers.installConfirm) {
        console.log(cli_1.LINEBREAK + "Starting the generation..." + cli_1.LINEBREAK);
        openapiNodegen_1["default"](config).then(function () {
            console.log((cli_1.LINEBREAK + "Done! \u2728").green);
            console.log((cli_1.LINEBREAK + "Your API files have been output here: ").yellow + cli.program.output.magenta + ".".green.bold);
        })["catch"](function (err) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                console.error('Something went wrong:'.red);
                console.trace(err);
                process.exit(1);
                return [2 /*return*/];
            });
        }); });
    }
    else {
        console.log('Generation cancelled. No files have been touched.'.red);
    }
})["catch"](function (e) {
    console.error(e);
});
process.on('unhandledRejection', function (err) {
    console.error(err);
});
