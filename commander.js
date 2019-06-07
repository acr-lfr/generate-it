const program = require('commander')
const path = require('path')
const packageInfo = require('./package.json')
require('colors')

module.exports = () => {
  let swaggerFile

  const parseOutput = dir => path.resolve(dir)

  program
    .version(packageInfo.version)
    .arguments('<swaggerFile>')
    .action((swaggerFilePath) => {
      swaggerFile = path.resolve(swaggerFilePath)
    })
    .option('-m, --mocked', 'If passed, the domains will be configured to return dummy content.')
    .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', process.cwd(), parseOutput)
    .option('-t, --template <template>', 'template to use (es6 or typescript)', 'es6')
    .option('-i, --ignored-modules <ignoredModules>', 'ignore the following type of modules (routes, controllers, domains, validators, transformers) in case they already exist (separated by commas)')
    .parse(process.argv)

  if (!swaggerFile) {
    console.error('> Path to Swagger file not provided.'.red)
    program.help()
    process.exit(0)
  } else {
    return {
      program: program,
      swaggerFile: swaggerFile
    }
  }
}
