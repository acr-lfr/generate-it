require('colors')
const fs = require('fs')
const path = require('path')
module.exports = (targetDir, templatesDir) => {
  const packagJsonStr = 'package.json'
  const existing = JSON.parse(fs.readFileSync(path.join(targetDir, packagJsonStr)))
  const newJson = JSON.parse(fs.readFileSync(path.join(templatesDir, packagJsonStr + '.njk')))

  let scriptsChanged = {}
  let dependenciesChanged = {}
  let devDependenciesChanged = {}
  const buildDiff = function (changed, from) {
    this['Changed To'] = changed
    this.from = from || 'Not present on existing package.json, please add.'
  }

  if (newJson.scripts) {
    Object.keys(newJson.scripts).forEach((key) => {
      if (!existing.scripts[key] || existing.scripts[key] !== newJson.scripts[key]) {
        scriptsChanged[key] = new buildDiff(newJson.scripts[key], existing.scripts[key])
      }
    })
  }

  if (newJson.dependencies) {
    Object.keys(newJson.dependencies).forEach((key) => {
      if (!existing.dependencies[key] || existing.dependencies[key] !== newJson.dependencies[key]) {
        dependenciesChanged[key] = new buildDiff(newJson.dependencies[key], existing.dependencies[key])
      }
    })
  }

  if (newJson.devDependencies) {
    Object.keys(newJson.devDependencies).forEach((key) => {
      if (!existing.devDependencies[key] || existing.devDependencies[key] !== newJson.devDependencies[key]) {
        devDependenciesChanged[key] = new buildDiff(newJson.devDependencies[key], existing.devDependencies[key])
      }
    })
  }

  if (Object.keys(scriptsChanged).length > 1) {
    console.log('The following package.json scripts have been updated:'.green)
    console.table(scriptsChanged)
  }
  if (Object.keys(dependenciesChanged).length > 1) {
    console.log('The following package.json dependencies have been updated:'.green)
    console.table(dependenciesChanged)
  }
  if (Object.keys(devDependenciesChanged).length > 1) {
    console.log('The following package.json devDependencies have been updated:'.green)
    console.table(devDependenciesChanged)
  }
}
