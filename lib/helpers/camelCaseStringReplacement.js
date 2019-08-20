const ucFirst = require('./ucFirst')
const lcFirst = require('./lcFirst')

/**
 *
 * @param input
 * @param {string|array} replace - String or array of string replacements
 * @return {string}
 */
module.exports = (input, replace) => {
  if(typeof replace === 'string'){
    replace = [replace]
  }
  if(!Array.isArray(replace)){
    throw Error('The replace values must be either a string or an array of strings.')
  }
  let returnString = ''
  replace.forEach((replaceItem, i) => {
    let replaceInString = (i === 0) ? input : returnString
    returnString = lcFirst((replaceInString.split(replaceItem).map((part) => {
      return ucFirst(part)
    })).join(''))
  })
  return returnString
}
