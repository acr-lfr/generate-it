import http423 from '../errors/423'

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * @returns {Function}
 */
export default () => {
  return (err, req, res, next) => {
    if (err instanceof http423) {
      res.status(423).send()
    } else {
      next(err)
    }
  }
}
