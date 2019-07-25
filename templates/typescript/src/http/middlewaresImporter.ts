import express from 'express'
import bodyParser from 'body-parser'
import corsMiddleware from './nodegen/middleware/corsMiddleware'
import headersCaching from './nodegen/middleware/headersCaching'
import morgan from 'morgan'
import requestIp from 'request-ip'
import packageJson from '../../package.json'
const expressFormData = require('express-form-data')

const responseHeaders = (app: express.Application) => {
  app.use(corsMiddleware())
  app.use(headersCaching())
}

const requestParser = (app: express.Application) => {
  // parse data with connect-multiparty
  app.use(expressFormData.parse({
    autoFiles: true,
    uploadDir: require('os').tmpdir(),
    autoClean: true,
  }))
  app.use(bodyParser.json({ limit: '50mb' }))

  // clear all empty files (size == 0)
  app.use(expressFormData.format())

  // union body and files
  app.use(expressFormData.union())

  // parse the body
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use(requestIp.mw())
}

const accessLogger = (app: express.Application) => {
  // Log all requests
  app.use(morgan(`[${packageJson.name}] :remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]`))
}

/**
 * Injects routes into the passed express app
 * @param app
 */
export default (app: express.Application) => {
  accessLogger(app)
  requestParser(app)
  responseHeaders(app)
}
