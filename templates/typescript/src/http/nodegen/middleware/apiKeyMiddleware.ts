import config from '../../../config'
import express = require('express')

import NodegenRequest from '../interfaces/NodegenRequest'

export default (headerName: string) => {
  return (req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    const deny = (e: any, message = 'Invalid api key provided', apiKey = '') => {
      console.error(e)
      res.status(401).json({
        message,
        apiKey,
      })
    }
    const apiKey = req.headers[headerName] || false
    if (!apiKey) {
      return deny('No api key was provided', 'No api key was provided', JSON.stringify(req.headers))
    }
    if (apiKey === config.apiKey) {
      next()
    } else {
      return deny('Invalid api key provided', 'Invalid api key provided')
    }
  }
}
