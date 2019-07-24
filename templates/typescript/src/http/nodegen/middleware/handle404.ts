export default () => {
  return (req, res) => {
    res.status(404)

    // respond with json
    if (req.accepts('json')) {
      return res.send({ error: 'Not found' })
    }
    // default to plain-text. send()
    return res.type('txt').send('Not found')
  }
}
