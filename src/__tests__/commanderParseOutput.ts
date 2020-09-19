import commanderParseOutput from '@/commanderParseOutput';
import fs from 'fs-extra';

it('Should resolve to directory that exists', () => {
  expect(fs.existsSync(commanderParseOutput('src/__tests__'))).toBe(true);
});
