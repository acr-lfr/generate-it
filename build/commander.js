"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("colors");
const commander_1 = tslib_1.__importDefault(require("commander"));
const path_1 = tslib_1.__importDefault(require("path"));
const packageInfo = require('../package.json');
exports.default = () => {
    let swaggerFile;
    const parseOutput = (dir) => path_1.default.resolve(dir);
    const cwd = process.cwd();
    commander_1.default
        .version(packageInfo.version)
        .arguments('<swaggerFile>')
        .action((swaggerFilePath) => {
        swaggerFile = path_1.default.resolve(swaggerFilePath);
    })
        .option('-m, --mocked', 'If passed, the domains will be configured to return dummy content.')
        .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, cwd)
        .option('-t, --template <template>', 'template to use (es6 or typescript)', 'es6')
        .option('-s, --segments-count <segmentsCount>', 'minimum number of segments to start merging', 1)
        .option('-i, --ignored-modules <ignoredModules>', 'ignore the following type of modules (routes, controllers, domains, validators, transformers) in case they already exist (separated by commas)')
        .option('-v, --verbose', 'Outputs verbose logging')
        .option('--very-verbose', 'Outputs very verbose logging')
        .parse(process.argv);
    if (!swaggerFile) {
        console.error('> Path to Swagger file not provided.'.red);
        commander_1.default.help();
        process.exit(0);
    }
    else {
        return {
            program: commander_1.default,
            swaggerFile,
        };
    }
};
