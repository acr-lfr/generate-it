require('colors')
const Diff = require('diff')

/**
 * Compares the diff between 2 file chunks
 * @param {string} title
 * @param {string} text1
 * @param {string} text2
 */
module.exports = async (title, text1, text2) => {
  let diff = Diff.diffTrimmedLines(text1, text2)
  if (diff.length > 0) {
    let go = false
    diff.map((part) => {
      if (part.added || part.removed) {
        go = true
      }
    })
    if (go) {
      console.log('FILE DIFF: ' + title)
      diff.forEach(function (part) {
        if (part && part.value) {
          if(part.added){
            console.log('New content')
            console.log(part.value.green)
          } else {
            console.log('Removed content')
            console.log(part.value.red)
          }
        }
      })
      console.log(' ')
    }
  }
}
