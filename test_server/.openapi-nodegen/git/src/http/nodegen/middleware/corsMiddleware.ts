import config from '../../../config';
import cors from 'cors';

/**
 * CORS middleware
 * Add to your config: config.corsWhiteList
 * The value should be a comma separated list of permitted domains
 */
export default () => {
  const whitelist = config.corsWhiteList.split(',');
  if (whitelist.length === 1 && whitelist[0] === '*') {
    return cors()
  }
  return cors({
    origin: (origin: string, callback: any) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })
}
