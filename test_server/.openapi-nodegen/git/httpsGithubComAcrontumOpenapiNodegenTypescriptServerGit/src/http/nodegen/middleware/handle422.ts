import http422 from '../errors/422';
import express = require('express');

import NodegenRequest from '../interfaces/NodegenRequest';

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * Read: ../errors/422.ts
 * @returns {Function}
 */
export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    if (err instanceof http422) {
      res.status(422).send()
    } else {
      next(err)
    }
  }
}
