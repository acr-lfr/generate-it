import config from '../../../config'
import cors from 'cors'

export default () => {
  const whitelist = config.corsWhiteList.split(',')
  if (whitelist.length === 1 && whitelist[0] === '*') {
    return cors()
  }
  return cors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })
}
