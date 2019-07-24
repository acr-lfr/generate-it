import http401 from '../errors/401'

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * @returns {Function}
 */
export default () => {
  return (err, req, res, next) => {
    if (err instanceof http401) {
      res.status(401).send()
    } else {
      next(err)
    }
  }
}
