const packageJsonClean = require('../packageJsonClean')

it('Should return a simple update', () => {
  const packageJson1 = {
    devDependencies: {
      bob: '^1.0.0',
      tim: '^1.0.0',
    },
    dependencies: {
      bob: '^1.0.0'
    }
  }
  const packageJson2 = {
    devDependencies: {
      tim: '^1.0.0',
    },
    dependencies: {
      bob: '^1.0.0',
    }
  }
  expect(packageJsonClean(packageJson1)).toEqual(packageJson2)
})

it('Should return a simple update', () => {
  const packageJson1 = {
    devDependencies: {
      bob: '^1.1.1',
      tim: '^2.0.1'
    },
    dependencies: {
      bob: '^1.0.0',
      tim: '^2.1.1'
    }
  }
  const packageJson2 = {
    devDependencies: {},
    dependencies: {
      bob: '^1.1.1',
      tim: '^2.1.1'
    }
  }
  expect(packageJsonClean(packageJson1)).toEqual(packageJson2)
})

it('Should return dupes', () => {
  const packageJson1 = {
    devDependencies: {
      bob: '^1.0.0',
      tim: '^3.0.1'
    },
    dependencies: {
      bob: '^2.1.1',
      tim: '^2.1.1'
    }
  }
  const packageJson2 = {
    devDependencies: {
      bob: '^1.0.0',
      tim: '^3.0.1'
    },
    dependencies: {
      bob: '^2.1.1',
      tim: '^2.1.1'
    }
  }
  expect(packageJsonClean(packageJson1)).toEqual(packageJson2)
})
