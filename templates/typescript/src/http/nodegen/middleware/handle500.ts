import express = require('express')

export default () => {
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack)
    if (err) return res.status(500).send(JSON.stringify({ message: err.message }))
    next(err)
  }
}
