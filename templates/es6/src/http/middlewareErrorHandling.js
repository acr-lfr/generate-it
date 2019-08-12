import handleValidationErrors from './nodegen/middleware/handleValidationErrors'
import handleStatusMessageErrors from './nodegen/middleware/handleStatusMessageErrors'
import handle401 from './nodegen/middleware/handle401'
import handle403 from './nodegen/middleware/handle403'
import handleExpress404 from './nodegen/middleware/handleExpress404'
import handleDomain404 from './nodegen/middleware/handleDomain404'
import handle410 from './nodegen/middleware/handle410'
import handle423 from './nodegen/middleware/handle423'
import handle500 from './nodegen/middleware/handle500'

/**
 * Injects routes into the passed express app
 * @param app
 */
export default (app) => {
  app.use(handleExpress404())
  app.use(handleDomain404())
  app.use(handle401())
  app.use(handle403())
  app.use(handle410())
  app.use(handle423())

  // Validation requests
  app.use(handleValidationErrors())

  // handle status:message errors
  app.use(handleStatusMessageErrors())

  // Handle 500 errors
  app.use(handle500())
}
