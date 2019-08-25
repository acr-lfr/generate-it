module.exports = (timeMilliseconds) => {
  return new Promise((resolve) => {
    setTimeout(()=>{
      resolve()
    }, timeMilliseconds)
  })
}
