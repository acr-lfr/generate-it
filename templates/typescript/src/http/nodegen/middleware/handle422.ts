import express = require('express')

export default () => {
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Check if the error is a joi error
    if (err.joi) {
      res.status(422).json(err)
    } else {
      next(err)
    }
  }
}
