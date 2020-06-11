import 'colors';
import program from 'commander';
import path from 'path';
import commanderParseOutput from '@/commanderParseOutput';
import commanderCollectArray from '@/commanderCollectObject';

const packageInfo = require('../package.json');

export default (inputArgsArray: string[]) => {
  let swaggerFile: any;
  program
    .version(packageInfo.version)
    .arguments('<swaggerFile>')
    .action((swaggerFilePath: string) => {
      swaggerFile = path.resolve(swaggerFilePath);
    })
    .option('-m, --mocked', 'If passed, the domains will be configured to return dummy content.')
    .option('-o, --output <outputDir>', 'directory where to put the rabbitMQ files (defaults to current directory)', commanderParseOutput, process.cwd())
    .requiredOption('-t, --template <helpers>', 'Full URL to a public git repo, eg github')
    .option('--dont-update-tpl-cache', 'If the given git url is already cached does not attempt to update', false)
    .option('--dont-run-comparison-tool', 'Skips the stub file comparison tool and version cleanup', false)
    .option('-s, --segments-count <segmentsCount>', 'minimum number of segments to start merging (not supported yet)', '1')
    .option('-$, --variables [value]', 'Array of variables to pass to the templates, eg "-$ httpLibImportStr=@/services/HttpService -$ apikey=321654987"', commanderCollectArray, {})
    .option('-v, --verbose', 'Outputs verbose logging')
    .option('--very-verbose', 'Outputs very verbose logging')
    .parse(inputArgsArray);

  if (!swaggerFile) {
    throw new Error('> Path to Swagger file not provided.'.red);
  } else {
    return {
      program,
      swaggerFile,
    };
  }
};
