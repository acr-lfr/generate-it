import express = require('express')

import NodegenRequest from '../models/NodegenRequest.model'

export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    // Check if the error is a joi error
    if (err.joi) {
      res.status(422).json(err)
    } else {
      next(err)
    }
  }
}
