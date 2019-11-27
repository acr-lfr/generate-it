import 'colors';
import program from 'commander';
import path from 'path';

const packageInfo = require('../package.json');

export default () => {
  let swaggerFile: any;

  const cwd = process.cwd();
  const parseOutput = (dir: any) => {
    return path.join(cwd, dir);
  };
  program
    .version(packageInfo.version)
    .arguments('<swaggerFile>')
    .action((swaggerFilePath: string) => {
      swaggerFile = path.resolve(swaggerFilePath);
    })
    .option('-m, --mocked', 'If passed, the domains will be configured to return dummy content.')
    .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, cwd)
    .option('-t, --template <template>', 'template to use (es6 or typescript)', 'es6')
    .option('--dont-update-tpl-cache', 'If the given git url is already cached does not attempt to update', false)
    .option('-s, --segments-count <segmentsCount>', 'minimum number of segments to start merging', 1)
    .option('-i, --ignored-modules <ignoredModules>', 'ignore the following type of modules (routes, controllers, domains, validators, transformers) in case they already exist (separated by commas)')
    .option('-v, --verbose', 'Outputs verbose logging')
    .option('--very-verbose', 'Outputs very verbose logging')
    .parse(process.argv);

  if (!swaggerFile) {
    console.error('> Path to Swagger file not provided.'.red);
    program.help();
    process.exit(0);
  } else {
    return {
      program,
      swaggerFile,
    };
  }
};
