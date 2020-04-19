const commandLineArgs = require('command-line-args');
const optionDefinitions = [{ name: 'port', alias: 'p', type: Number }];

/**
 * Export the cli options passed via cli when starting the application
 * @returns {Object}
 */
export default () => {
  return commandLineArgs(optionDefinitions);
};
