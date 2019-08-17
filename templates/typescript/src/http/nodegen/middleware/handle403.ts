import express = require('express')
import http403 from '../errors/403'

import NodegenRequest from '../interfaces/NodegenRequest.model'

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * @returns {Function}
 */
export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    if (err instanceof http403) {
      res.status(403).send()
    } else {
      next(err)
    }
  }
}
