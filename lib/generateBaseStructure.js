const deepmerge = require('deepmerge')
const fs = require('fs-extra')
const path = require('path')

/**
 * Creates the base structure
 * @param target_dir
 * @param templates_dir
 * @param additionalOptionsToInject
 * @return void
 */
module.exports = (target_dir, templates_dir, additionalOptionsToInject) => {
  additionalOptionsToInject = additionalOptionsToInject || {}
  fs.mkdirsSync(target_dir)
  const callerPackageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJsonFound = (fs.existsSync(callerPackageJsonPath))
  console.log('>>' + packageJsonFound)
  fs.copySync(templates_dir, target_dir, {
    filter: (src) => {
      if (packageJsonFound) {
        if (src.indexOf('package.json') !== -1) {
          return false
        }
      }
      return true
    }
  })

  if (packageJsonFound) {
    // merge the package json files together
    const callerPackageJson = fs.readJsonSync(callerPackageJsonPath)
    const templatePackageJson = JSON.parse(fs.readFileSync(path.join(templates_dir, 'package.json.njk'), 'utf8'))
    console.log(additionalOptionsToInject)
    let merged = Object.assign(deepmerge(callerPackageJson, templatePackageJson), additionalOptionsToInject)
    fs.writeJsonSync(
      callerPackageJsonPath,
      merged,
      {
        spaces: 2
      }
    )
  }
}
