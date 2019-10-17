const semver = require('semver')
module.exports = (packageJsonObject) => {
  if (!packageJsonObject.dependencies || !packageJsonObject.devDependencies) {
    return packageJsonObject
  }
  const prodDeps = Object.keys(packageJsonObject.dependencies)
  const devDeps = Object.keys(packageJsonObject.devDependencies)
  devDeps.forEach((devDep) => {
    const prodDepsIndex = prodDeps.indexOf(devDep)
    if (prodDepsIndex !== -1) {
      // we have a duplicate, check which is newer
      const prodRaw = packageJsonObject.dependencies[prodDeps[prodDepsIndex]]
      const devRaw = packageJsonObject.devDependencies[devDep]
      const devCoerced = semver.valid(semver.coerce(devRaw))
      const prodCoerced = semver.valid(semver.coerce(prodRaw))
      if (semver.satisfies(devCoerced, prodRaw) || semver.satisfies(prodCoerced, devRaw)) {
        packageJsonObject.dependencies[devDep] = (semver.gt(devCoerced, prodCoerced)) ? devRaw : prodRaw
        delete packageJsonObject.devDependencies[devDep]
      } else {
        console.error('You have duplicate packages in the package.json file, the devDep does not satisfy the prod dep please adjust these manually')
        console.error('Name: ' + devDep)
        console.error('Prod version: ' + packageJsonObject.dependencies[devDep])
        console.error('Dev version: ' + packageJsonObject.devDependencies[devDep])
        console.log('_____________')
      }
    }
  })
  return packageJsonObject
}
