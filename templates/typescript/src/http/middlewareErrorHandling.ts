import express from 'express'
import handle401 from './nodegen/middleware/handle401'
import handle403 from './nodegen/middleware/handle403'
import handle404 from './nodegen/middleware/handle404'
import handle410 from './nodegen/middleware/handle410'
import handle422 from './nodegen/middleware/handle422'
import handle423 from './nodegen/middleware/handle423'
import handle500 from './nodegen/middleware/handle500'

/**
 * Injects routes into the passed express app
 * @param app
 */
export default (app: express.Application) => {
  app.use(handle404())
  app.use(handle401())
  app.use(handle403())
  app.use(handle410())
  app.use(handle423())

  // Validation requests
  app.use(handle422())

  // Handle 500 errors
  app.use(handle500())
}
