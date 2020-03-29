#!/usr/bin/env node
import 'colors';
import * as inquirer from 'inquirer';
import path from 'path';
import cliInput from './commander';
import openapiNodegen from './openapiNodegen';
import { LINEBREAK } from '@/constants/cli';
import Config from '@/interfaces/Config';

const cli = cliInput(process.argv);

console.log(`Provided arguments look ok, preceding to build the http layer and any stub files ${LINEBREAK}`.yellow);

const config: Config = {
  verbose: cli.program.verbose || false,
  veryVerbose: cli.program.veryVerbose || false,
  dontRunComparisonTool: cli.program.dontRunComparisonTool,
  dontUpdateTplCache: cli.program.dontUpdateTplCache,
  swaggerFilePath: cli.swaggerFile,
  targetDir: cli.program.output,
  template: cli.program.template,
  segmentsCount: cli.program.segmentsCount,
  handlebars_helper: cli.program.handlebars ? path.resolve(process.cwd(), cli.program.handlebars) : undefined,
  ignoredModules: cli.program.ignoredModules ? cli.program.ignoredModules.split(',') : [],
  mockServer: cli.program.mocked || false,
};
const question = `Continuing will replace the entire http layer:`.green + `
- ___interface|mock|op files are classed as the http layer and will be regenerated based on the provide api file, meaning local changes to these files will be lost.
- Differences in the ___stub files, new|removed|changed methods (typically the domain layer) will be output to the console.
- See the manual for further information: https://acrontum.github.io/openapi-nodegen/
- This message is of no concern for a 1st time run.` + `

Are you sure you wish to continue?
`.green;

const questions = [{
  type: 'confirm',
  name: 'installConfirm',
  message: question,
  default: false,
}];
inquirer.prompt(questions)
  .then((answers: any) => {
    if (answers.installConfirm) {
      console.log(`${LINEBREAK}Starting the generation...${LINEBREAK}`);
      openapiNodegen(config).then(() => {
        console.log(`${LINEBREAK}Done! ✨`.green);
        console.log(`${LINEBREAK}Your API files have been output here: `.yellow + cli.program.output.magenta + `.`.green.bold);
      }).catch(async (err: any) => {
        console.error('Something went wrong:'.red);
        console.trace(err);
        process.exit(1);
      });
    } else {
      console.log('Generation cancelled. No files have been touched.'.red);
    }
  })
  .catch((e: any) => {
    console.error(e);
  });

process.on('unhandledRejection', (err) => {
  console.error(err);
});
