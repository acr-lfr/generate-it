#!/usr/bin/env node
import 'colors';
import * as inquirer from 'inquirer';
import cliInput from './commander';
import generateIt from './generateIt';
import { LINEBREAK } from '@/constants/cli';
import { Config } from '@/interfaces/Config';
import versionCheck from 'npm-tool-version-check';

process.on('unhandledRejection', (err) => {
  console.error(err);
});

const cli = cliInput(process.argv);

if (cli.program.yes) {
  process.env.npm_tool_version_check__quiet = 'true';
}

versionCheck(
  require('../package.json').version,
  'generate-it',
  'Generate It'
).then(() => {
  console.log(`Provided cli args look ok, preceding to build the http layer and any stub files... ${LINEBREAK}`.yellow);
  const config: Config = {
    verbose: cli.program.verbose || false,
    veryVerbose: cli.program.veryVerbose || false,
    dontRunComparisonTool: cli.program.dontRunComparisonTool,
    dontUpdateTplCache: cli.program.dontUpdateTplCache,
    updateDependenciesFromTpl: cli.program.updateDependenciesFromTpl,
    swaggerFilePath: cli.swaggerFile,
    targetDir: cli.program.output,
    template: cli.program.template,
    variables: cli.program.variables,
    segmentFirstGrouping: cli.program.segmentFirstGrouping,
    segmentSecondGrouping: cli.program.segmentSecondGrouping,
    handlebars_helper: undefined, // todo add the ability to inject custom helpers, this will allow the extraction of Joi form the core
    mockServer: cli.program.mocked || false,
    renderOnlyExt: cli.program.renderOnlyExt,
    dontPrettify: cli.program.dontPrettify,
  };

  const call = () => {
    console.log(`${LINEBREAK}Starting the generation...${LINEBREAK}`);
    generateIt(config).then(() => {
      console.log(`${LINEBREAK}Done! ☺`.green.bold);
      console.log(`${LINEBREAK}Your API files have been output here: `.yellow + cli.program.output.magenta + `.`.green.bold);
    }).catch(async (err: any) => {
      console.error('Something went wrong:'.red);
      console.trace(err);
      process.exit(1);
    });
  };

  if (cli.program.yes) {
    return call();
  }

  const question = `Continuing will replace the entire http layer:`.green + `
- ___interface|mock|op files are classed as the http layer and will be regenerated based on the provide api file, meaning local changes to these files will be lost.
- Differences in the ___stub files, new|removed|changed methods (typically the domain layer) will be output to the console.
- See the manual for further information: https://acrontum.github.io/generate-it/
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
        call();
      } else {
        console.log('Generation cancelled. No files have been touched.'.red);
      }
    })
    .catch((e: any) => {
      console.error(e);
    });
}).catch(() => {
  console.log('Generation cancelled.'.red);
  process.exit(0);
});
