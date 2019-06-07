module.exports = (responses) => {
  if (responses['200']) {
    if (responses['200'].schema) {
      // we are oa2
      return responses['200'].schema
    } else {
      // we are oa3
      if (responses['200']['content'] && responses['200']['content']['application/json']) {
        if (responses['200']['content']['application/json'].schema) {
          return responses['200']['content']['application/json'].schema
        }
      }
    }
  }
  return {}
}
