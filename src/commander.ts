import 'colors';
import program from 'commander';
import path from 'path';
import commanderParseOutput from '@/commanderParseOutput';

const packageInfo = require('../package.json');

export default () => {
  let swaggerFile: any;

  program
    .version(packageInfo.version)
    .arguments('<swaggerFile>')
    .action((swaggerFilePath: string) => {
      swaggerFile = path.resolve(swaggerFilePath);
    })
    .option('-m, --mocked', 'If passed, the domains will be configured to return dummy content.')
    .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', commanderParseOutput, process.cwd())
    .requiredOption('-t, --template <helpers>', 'Full URL to a public git repo, eg github')
    .option('--dont-update-tpl-cache', 'If the given git url is already cached does not attempt to update', false)
    .option('--dont-run-comparison-tool', 'Skips the stub file comparison tool and version cleanup', false)
    .option('-s, --segments-count <segmentsCount>', 'minimum number of segments to start merging', 1)
    .option('-v, --verbose', 'Outputs verbose logging')
    .option('--very-verbose', 'Outputs very verbose logging')
    .parse(process.argv);

  if (!swaggerFile) {
    throw new Error('> Path to Swagger file not provided.'.red);
  } else {
    return {
      program,
      swaggerFile,
    };
  }
};
