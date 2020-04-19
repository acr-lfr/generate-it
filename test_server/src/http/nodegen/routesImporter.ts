import express = require('express')
import config from '../../config'
import weatherRoutes from './routes/weatherRoutes'
import swaggerRoutes from './routes/swaggerRoutes'

export default function (app: express.Application) {
  
  app.use('/weather', weatherRoutes())
    

  if (config.env === 'develop') {
    
    app.use('/swagger', swaggerRoutes())
    
  }
}
