import http410 from '../errors/410'
import express = require('express')

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * @returns {Function}
 */
export default () => {
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof http410) {
      res.status(410).send()
    } else {
      next(err)
    }
  }
}
