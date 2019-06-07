import faker from 'faker'

import fakerMethods from './fakerMethods'

export const fakerGenerator = (type) => {
  const method = fakerMethods.find((m) => {
    const typeSplit = type.split('.')
    if (typeSplit.length === 1) {
      // not full method name
      return type.toLowerCase() === m.split('.')[1].toLowerCase()
    } else {
      // full method name
      return type.toLowerCase() === m.toLowerCase()
    }
  })
  if (method) {
    const methodSplitter = method.split('.')
    return faker[methodSplitter[0]][methodSplitter[1]]()
  }
  return false
}
