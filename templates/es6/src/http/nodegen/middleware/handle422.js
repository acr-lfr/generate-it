import http422 from '../errors/422'

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * @returns {Function}
 */
export default () => {
  return (err, req, res, next) => {
    if (err instanceof http422) {
      res.status(422).send()
    } else {
      next(err)
    }
  }
}
