module.exports = (o) => {
  console.log(' ')
  if (typeof o === 'object') {
    console.log(JSON.stringify(o, undefined, 2))
  } else {
    console.log(o)
  }
  console.log(' ')
}
