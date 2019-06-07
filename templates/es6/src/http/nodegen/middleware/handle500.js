export default () => {
  return (err, req, res, next) => {
    console.error(err.stack)
    if (err) return res.status(500).send(JSON.stringify({ message: err.message }))
    next(err)
  }
}
