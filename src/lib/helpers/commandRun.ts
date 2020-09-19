import child_process from 'child_process';

const spawn = child_process.spawn;

/**
 * Runs a shell command with given arguments in an array
 * @param {string} program - The string of the command, eg ln
 * @param {array} args - Array of string options to pass to the program eg ['-s', '/file/path/to/link', 'symlink/path']
 * @param {boolean} [verbose] - Default false, when true console logs all output
 * @return {Promise<unknown>}
 */
interface CommandRunResolve {
  outputString: string;
  outputErrorString: string;
}

export default (program: string, args: string[] = [], verbose: boolean = false): Promise<CommandRunResolve> => {
  return new Promise((resolve, reject) => {
    if (verbose) {
      console.log(program + ' ' + args.join(' '));
    }
    const command = spawn(program, args);
    let outputString = '';
    let outputErrorString = '';
    command.stdout.on('data', function (data: any) {
      if (verbose) {
        console.log('NORMAL');
      }
      if (verbose && data !== '') {
        console.log(String(data));
      }
      outputString += String(data);
    });

    command.stderr.on('data', function (data: any) {
      if (verbose) {
        console.log('ERROR');
      }
      if (verbose && data !== '') {
        console.log(String(data));
      }
      outputErrorString += String(data);
    });

    command.on('close', function (code: number) {
      if (code === 0) {
        resolve({ outputString, outputErrorString });
      } else {
        reject({ code, outputString, outputErrorString });
      }
    });
  });
};
