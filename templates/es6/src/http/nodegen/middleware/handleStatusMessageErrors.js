export default () => {
  return (err, req, res, next) => {
    const msgSplit = err.message.split(':')
    if (err.message.includes(':') && err.message.split(':').length > 0) {
      return res.status(Number(msgSplit[0])).json({ message: msgSplit[1] })
    }
    next(err)
  }
}
