import * as generators from './index'
import { randomNumber } from './numberGenerator'

const walker = (schema) => {
  if(!schema.type && schema.properties){
    schema.type = 'object'
  }
  switch (schema.type) {
    case 'string':
      return generators.stringGenerator(schema)
    case 'number':
      return generators.numberGenerator(schema)
    case 'integer':
      return generators.integerGenerator(schema)
    case 'boolean':
      return generators.booleanGenerator(schema)
    case 'array':
      if (!schema.items) {
        return []
      } else {
        const min = schema.minItems || 1
        const max = schema.minItems || 10
        const random = randomNumber(min, max)
        let arr = []
        for (let i = 0; i < random; ++i) {
          arr.push(walker(schema.items))
        }
        return arr
      }
    case 'object':
      let obj = {}
      Object.keys(schema.properties).forEach((key) => {
        obj[key] = walker(schema.properties[key])
      })
      return obj
  }
}

export const mockItGenerator = (schema) => {
  if(Object.keys(schema).length === 0) {
    return {}
  }
  if (!schema.type) {
    throw new Error('no type found in oa schema')
  }
  return walker(schema)
}
