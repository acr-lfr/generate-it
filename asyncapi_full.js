const openapiNodegen = require('./build/generateIt').default
const path = require('path')

const serverDir = 'test_asyncapi'
const testServerPath = path.join(process.cwd(), serverDir)
const tplUrl = 'https://github.com/acrontum/generate-it-asyncapi-rabbitmq.git'
const ymlPath = path.join(process.cwd(), 'test_asyncapi.yml')
openapiNodegen({
  dontRunComparisonTool: false,
  dontUpdateTplCache: true,
  mockServer: false,
  segmentsCount: 1,
  swaggerFilePath: ymlPath,
  targetDir: testServerPath,
  template: tplUrl,
}).catch((e) => {
  console.log(e)
})
