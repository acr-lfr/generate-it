You can also use this tool within a node script.

Here is an example of a frontend end application building multiple clients from a multiple api files but all using 1 override for the HttpService:
```js
require('colors')
const generateIt = require('generate-it/build/generateIt').default

const config = [
  {
    from: '../../backend/ms_authentication_d/build/ms-authentication-d_1.0.1.yml', // (-d stands for documentation)
    to: 'src/api/ms-authentication'
  },
  {
    from: '../../backend/ms_item_d/build/ms-item-d_1.0.0.yml',
    to: 'src/api/ms-item'
  },
]  
const generate = (configArray) => {
  if (configArray.length === 0) {
    console.log('Completed the generate of all apis.'.blue.bold)
  } else {
    const item = configArray.shift()
    generateIt({
      dontRunComparisonTool: false,
      dontUpdateTplCache: false,
      mockServer: false,
      segmentsCount: 1,
      swaggerFilePath: item.from,
      targetDir: item.to,
      template: 'https://github.com/acr-lfr/generate-it-typescript-client-to-server',
      variables: {
        httpServiceImport: '@/services/HttpService'
      }
    })
      .then(() => {
        console.log(`API generated: ${item.to}`.blue.bold)
        generate(configArray)
      })
      .catch((e) => {
        console.log('API generation error: ', e)
      })
  }
}

generate(config)
```
