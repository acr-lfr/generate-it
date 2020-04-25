module.exports = {
  apps: [{
    name: require('./package.json').name,
    script: './build/server.js',
    ignore_watch: [
      '.git',
      '.idea',
      'node_modules',
      'src',
    ],
    watch: ['build', 'src/views', '.env'],
  }],
}
