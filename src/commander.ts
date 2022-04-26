import 'colors';
import program from 'commander';
import commander from 'commander';
import path from 'path';
import commanderParseOutput from '@/commanderParseOutput';
import commanderCollectArray from '@/commanderCollectObject';

const packageInfo = require('../package.json');

interface Program extends commander.CommanderStatic {
  template: string;
  mocked?: boolean;
  output?: string;
  'dont-update-tpl-cache'?: boolean;
  'dont-run-comparison-tool'?: boolean;
  'update-dependencies-from-tpl'?: boolean;
  'segment-first-grouping'?: number;
  'segment-second-grouping'?: number;
  variables?: any[];
  verbose?: boolean;
  'very-verbose'?: boolean;
  'yes'?: boolean;
  'render-only-ext'?: string;
  'dont-prettify'?: boolean;
}

export interface CommanderResponse {
  program: Program;
  swaggerFile: string;
}

export default (inputArgsArray: string[]): CommanderResponse => {
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
    .option('-u, --update-dependencies-from-tpl', 'Run the npm install scripts inline with the tpl package.json opposed to displaying for manual update', false)
    .option('--segment-first-grouping <number>', 'If set will split a domain by group the 1 qty of segments defined in this setting, see endpointNameCalculation.ts')
    .option('--segment-second-grouping <number>', 'Assuming the 1st grouping is set, this will group the 2nd group into another 2 groups, see endpointNameCalculation.ts')
    .option('-$, --variables [value]', 'Array of variables to pass to the templates, eg "-$ httpLibImportStr=@/services/HttpService -$ apikey=321654987"', commanderCollectArray, {})
    .option('-v, --verbose', 'Outputs verbose logging')
    .option('--very-verbose', 'Outputs very verbose logging')
    .option('-y, --yes', 'Assumes yes to any questions prompted by the tool. If marked yes we assume you know what you are doing and know the nodegenDir will be rewritten')
    .option('--render-only-ext <extension>', 'Defines which extension should be processed. If none is informed all files will be processed')
    .option('--dont-prettify', 'Defines if should ignore prettier after generate the source', false)
    .parse(inputArgsArray);

  if (!swaggerFile) {
    throw new Error('> Path to Swagger file not provided.'.red);
  } else if (program.program.output !== process.cwd() && program.program.updateDependenciesFromTpl) {
    throw new Error('> Currently the auto dependency updates cannot be run when the target is not the current directory'.red);
  } else {
    return {
      program,
      swaggerFile,
    } as CommanderResponse;
  }
};
