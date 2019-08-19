const spawn = require('child_process')
/**
 * Runs a shell command with given arguments in an array
 * @param {string} program - The string of the command, eg ln
 * @param {array} args - Array of string options to pass to the program eg ['-s', '/file/path/to/link', 'symlink/path']
 * @param {boolean} [verbose] - Default false, when true console logs all output
 * @return {Promise<unknown>}
 */
module.exports = (program, args, verbose = false) => {
  return new Promise((resolve, reject) => {
    const command = spawn(program, args)
    let outputString = ''
    let outputErrorString = ''
    command.stdout.on('data', function (data) {
      if (verbose) {
        console.log(data)
      }
      outputString += data
    })

    command.stderr.on('data', function (data) {
      if (verbose) {
        console.log(data)
      }
      outputErrorString += data
    })

    command.on('close', function (code) {
      if (code === 0) {
        resolve(outputString, outputErrorString)
      } else {
        reject(code, outputString, outputErrorString)
      }
    })
  })
}
