import express from 'express'

import routesImporter from './http/nodegen/routesImporter'
import middlewaresImporter from './http/middlewaresImporter'
import middlewareErrorHandling from './http/middlewareErrorHandling'

const app = express()

middlewaresImporter(app)
routesImporter(app)
middlewareErrorHandling(app)

export default app
