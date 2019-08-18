import express = require('express')

import NodegenRequest from '../interfaces/NodegenRequest'

export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack)
    if (err) return res.status(500).send(JSON.stringify({ message: err.message }))
    next(err)
  }
}
