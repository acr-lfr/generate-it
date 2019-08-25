#!/usr/bin/env node
require('colors')
const path = require('path')
const inquirer = require('inquirer')
const progressBar = require('progress')
const cli = require('./commander')()
const pause = require('./lib/pause')
const codegen = require('./lib')

console.log(`Provided arguments look ok, preceding to build the http layer and any stub files.

`.yellow)

global.verboseLogging = (o) => {
  if (cli.program.verbose) {
    console.log(' ')
    if (typeof o === 'object') {
      console.log(JSON.stringify(o, undefined, 2))
    } else {
      console.log(o)
    }
    console.log(' ')
  }
}

let timerComplete = false
const timer = () => {
  if (!cli.program.verbose) {
    let bar = new progressBar(':bar', { total: 10 })
    let timer = setInterval(function () {
      bar.tick()
      if (timerComplete) {
        clearInterval(timer)
      }
    }, 100)
  }
}

const go = (mockServer) => {
  codegen({
    swaggerFilePath: cli.swaggerFile,
    targetDir: cli.program.output,
    template: cli.program.template,
    segmentsCount: +cli.program.segmentsCount,
    handlebars_helper: cli.program.handlebars ? path.resolve(process.cwd(), cli.program.handlebars) : undefined,
    ignoredModules: cli.program.ignoredModules ? cli.program.ignoredModules.split(',') : [],
    mockServer: mockServer || false,
  }).then(async () => {
    timerComplete = true
    await pause(150)
    console.log(`
Done! ✨`.green.bold)
    console.log('Your API files have been output here: '.yellow + cli.program.output.magenta + '.'.yellow)
  }).catch(async (err) => {
    timerComplete = true
    await pause(150)
    console.error(`
Aaww `.red + '💩'.red.bold + '. Something went wrong:'.red)
    console.error(err.stack.red || err.message.red)
  })
}

let question = `Continuing will replace the entire http layer:`.green +
  `
- ___interface|mock|op files are classed as the http layer and will be regenerated based on the provide api file, meaning local changes will be lost. 
- Differences in the ___stub files, new|removed|changed methods (typically the domain layer) will be output to the console.
- See the manual for further information: https://acrontum.github.io/openapi-nodegen/
- This message is of no concern for a 1st time run.
` +
  `Are you sure you wish to continue?
`.green

const questions = [{
  type: 'confirm',
  name: 'installConfirm',
  message: question,
  default: false
}]
inquirer.prompt(questions)
  .then((answers) => {
    if (answers.installConfirm) {
      console.log(`
Starting the generation...
`)
      timer()
      go(cli.program.mocked)
    } else {
      timerComplete = true
      console.log('Generation cancelled. No files have been touched.'.red)
    }
  })
  .catch((e) => {
    timerComplete = true
    console.error(e)
  })

process.on('unhandledRejection', (err) => {
  timerComplete = true
  console.error(err)
})
