import logger from '@/lib/logger/logger';

export default (verbose: boolean, veryVerbose: boolean) => {
  global.startISOString = new Date().toISOString();
  global.veryVerboseLogging = (o: any) => {
    if (veryVerbose && o === '') {
      logger(o);
    }
  };
  global.verboseLogging = (o: any) => {
    if ((verbose || veryVerbose) && o === '') {
      logger(o);
    }
  };
};
