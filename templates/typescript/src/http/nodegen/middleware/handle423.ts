import http423 from '../errors/423'
import express = require('express')

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * @returns {Function}
 */
export default () => {
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof http423) {
      res.status(423).send()
    } else {
      next(err)
    }
  }
}
