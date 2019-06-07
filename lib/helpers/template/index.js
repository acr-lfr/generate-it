const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(__dirname)
let object = {}
files.forEach((file) => {
  if(file.indexOf('__tests__') === -1){
    object[path.basename(file, '.js')] = require(path.join(__dirname, file))
  }
})

module.exports = object
