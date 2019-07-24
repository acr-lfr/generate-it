import express = require('express')

export default () => {
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const msgSplit = err.message.split(':')
    if (err.message.includes(':') && err.message.split(':').length > 0) {
      return res.status(Number(msgSplit[0])).json({ message: msgSplit[1] })
    }
    next(err)
  }
}
