module.exports = {
  apps: [{
    name: require('./package.json').name,
    script: './build/server.js',
  }],
}
