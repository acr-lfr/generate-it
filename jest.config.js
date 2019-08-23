// jest.config.js
// https://jestjs.io/docs/en/configuration#coveragethreshold-object
module.exports = {
  verbose: true,
  collectCoverage: true,
  coverageDirectory: './jest',
  collectCoverageFrom: [
    "./lib/**/*.{js,jsx}",
  ]
};
