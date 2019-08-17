import express = require('express')

import NodegenRequest from '../interfaces/NodegenRequest.model'

export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    const msgSplit = err.message.split(':')
    if (err.message.includes(':') && err.message.split(':').length > 0) {
      return res.status(Number(msgSplit[0])).json({ message: msgSplit[1] })
    }
    next(err)
  }
}
