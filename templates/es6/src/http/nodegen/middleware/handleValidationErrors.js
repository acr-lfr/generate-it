export default () => {
  return (err, req, res, next) => {
    // Check if the error is a joi error
    if (err.joi) {
      res.status(422).json(err)
    } else {
      next(err)
    }
  }
}
