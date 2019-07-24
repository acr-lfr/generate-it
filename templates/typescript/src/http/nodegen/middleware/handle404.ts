import express = require('express')

export default () => {
  return (req: express.Request, res: express.Response) => {
    res.status(404)

    // respond with json
    if (req.accepts('json')) {
      return res.send({ error: 'Not found' })
    }
    // default to plain-text. send()
    return res.type('txt').send('Not found')
  }
}
