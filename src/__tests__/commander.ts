import cliInput from '@/commander';
import path from 'path';

describe('Check all program options are captured and names correctly', () => {
  it('should return all the program options in the returned object', () => {
    const args = [
      'node',
      'script.js',
      'myfile.yml',
      '-m',
      '-o', 'mydir',
      '-t', 'https://www.mygit.com',
      '--dont-update-tpl-cache',
      '--segment-first-grouping', '3',
      '-v',
      '--very-verbose',
    ];
    const cli = cliInput(args);
    expect(cli.swaggerFile).toBe(path.join(process.cwd(), 'myfile.yml'));
    expect(cli.program.mocked).toBe(true);
    expect(cli.program.output).toBe(path.join(process.cwd(), 'mydir'));
    expect(cli.program.template).toBe('https://www.mygit.com');
    expect(cli.program.dontUpdateTplCache).toBe(true);
    expect(cli.program.dontRunComparisonTool).toBe(false);
    expect(cli.program.updateDependenciesFromTpl).toBe(false);
    expect(cli.program.segmentFirstGrouping).toBe('3');
    expect(cli.program.verbose).toBe(true);
    expect(cli.program.veryVerbose).toBe(true);
  });
});
