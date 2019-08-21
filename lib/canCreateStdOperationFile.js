module.exports = (toMock, path, fileName) => {
  if (fileName.substr(0, 3) !== '___') {
    return false
  }
  if (toMock) {
    return true
  }
  return path.indexOf('__mocks__') === -1
}
