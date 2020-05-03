import express = require('express')
import config from '../../config'
import weatherRoutes from './routes/weatherRoutes'
import rainRoutes from './routes/rainRoutes'
import swaggerRoutes from './routes/swaggerRoutes'

export default function (app: express.Application) {
  
  app.use('/data/2.5/weather', weatherRoutes())
    
  app.use('/data/2.5/rain', rainRoutes())
    

  if (config.env === 'develop') {
    
    app.use('/data/2.5/swagger', swaggerRoutes())
    
  }
}
