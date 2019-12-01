import cliInput from '@/commander';
import path from 'path';

describe('Check all program options are captured and names correctly', () => {
  it('should return all the program options in the returned object', () => {
    const previousArgv = process.argv;
    process.argv = [
      'node',
      'script.js',
      'myfile.yml',
      '-m',
      '-o', 'mydir',
      '-t', 'https://www.mygit.com',
      '--dont-update-tpl-cache',
      '-s', '3',
      '-v',
      '--very-verbose',
    ];
    const cli = cliInput();
    expect(cli.swaggerFile).toBe(path.join(process.cwd(), 'myfile.yml'));
    expect(cli.program.mocked).toBe(true);
    expect(cli.program.output).toBe(path.join(process.cwd(), 'mydir'));
    expect(cli.program.template).toBe('https://www.mygit.com');
    expect(cli.program.dontUpdateTplCache).toBe(true);
    expect(cli.program.segmentsCount).toBe('3');
    expect(cli.program.verbose).toBe(true);
    expect(cli.program.veryVerbose).toBe(true);
    process.argv = previousArgv;
  });

  it('should throw an error for no api file passed', (done) => {
    const previousArgv = process.argv;
    try {
      process.argv = [
        'node',
        'script.js',
      ];
      cliInput();
      process.argv = previousArgv;
      done('Should have thrown an error for no input provided');
    } catch (e) {
      process.argv = previousArgv;
      done();
    }
  });
});
