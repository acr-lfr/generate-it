class FileTypeCheck {
  isOpertationFile (name) {
    return name.substr(0, 5) === '___op'
  }

  isMockFile (name) {
    return name.substr(0, 7) === '___mock'
  }

  isStubFile (name) {
    return name.substr(0, 7) === '___stub'
  }

  isInterfaceFile (name) {
    return name.substr(0, 12) === '___interface'
  }
}

module.exports = new FileTypeCheck()
