import express = require('express')

import NodegenRequest from '../interfaces/NodegenRequest'

/**
 * Express middleware to control the http headers for caching only
 * @returns {Function}
 */
export default () => {
  return (req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.header('Expires', 'Thu, 19 Nov 1981 08:52:00 GMT')
    next()
  }
}
