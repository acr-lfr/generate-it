import http429 from '../errors/429';

import NodegenRequest from '../interfaces/NodegenRequest';
import express = require('express');

/**
 * Required for if an too many request response should be thrown from a domain or controller
 * @returns {Function}
 */
export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    if (err instanceof http429) {
      res.status(429).send();
    } else {
      next(err);
    }
  };
}
