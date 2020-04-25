import express = require('express');

import NodegenRequest from '../../interfaces/NodegenRequest';

/**
 * The JOI/Celebrate error handler.
 * Simply expects a joi attribute to be present in the thrown object
 */
export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    // Check if the error is a joi error
    if (err.joi) {
      res.status(422).json(err);
    } else {
      next(err)
    }
  }
}
