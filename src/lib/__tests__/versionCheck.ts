import versionCheck from '@/lib/versionCheck';

it('should pass', async (done) => {
  const thisVersion = require('../../../package.json').version;
  await versionCheck(thisVersion);
  done();
});
