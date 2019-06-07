'use strict'
const path = require('path')
const packageJson = require('./package.json')
const fs = require('fs')
const nodeModules = {}

// UNCOMENT THIS IF YOUR BUILT SERVER IS NOT WORKING AND THE WORLD IS ON FIRE.
// BUT.. LINK YOUR NODE_MODULES INTO YOUR DOCKER FILE IF YOU DO.
// fs.readdirSync('node_modules').filter(function (x) {
//   return ['.bin'].indexOf(x) === -1
// }).forEach(function (mod) {
//   nodeModules[mod] = 'commonjs ' + mod
// })

const excludeModules = ['swagger-ui-express']
excludeModules.forEach((mod) => {
  nodeModules[mod] = 'commonjs ' + mod
})

let PATHS = {
  app: path.join(__dirname, '/src'),
  built: path.join(__dirname, '/build'),
}

let plugins = []

let env = process.env.WEBPACK_ENV
if (env === 'build') {
  // push optional plugins for build only
}

let moduleRules = [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },]
if (!packageJson.mockingServer) {
  moduleRules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    options: {
      // eslint options (if necessary)
    }
  })
}

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    './server.js',
  ],
  devtool: 'source-map',
  target: 'node',
  output: {
    path: PATHS.built,
    filename: 'server.js',
    library: 'server',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  externals: nodeModules,
  module: {
    rules: moduleRules,
  },
  performance: {
    hints: 'warning',
  },
  plugins: plugins,
  resolve: {
    modules: [
      './node_modules',
      path.resolve(__dirname),
      path.resolve(path.join(__dirname, '/src')),
      path.resolve('./config'),
    ],
  },
  node: {
    fs: 'empty',
  },
}
