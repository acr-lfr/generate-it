import { randomNumber } from './numberGenerator'
import { fakerGenerator } from './fakerGenerator'

const uuidv1 = require('uuid/v1')
const btoa = require('btoa')

export const stringGenerator = (schemaPart, schemaName) => {
  // use schemaName to fake with faker
  if (schemaPart['x-faker']) {
    const randomVal = fakerGenerator(schemaPart['x-faker'])
    if (randomVal) return randomVal
  }
  if (schemaName) {
    const randomVal = fakerGenerator(schemaName)
    if (randomVal) return randomVal
  }

  const randomString = (length) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  if (schemaPart.format) {
    switch (schemaPart.format) {
      case 'date':
        const date = new Date(Math.random() * new Date().getTime())
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        return year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0')
      case 'date-time':
        return new Date(Math.random() * new Date().getTime())
      case 'byte':
        return btoa(randomString(randomNumber(10, 50)))
      case 'email':
        return randomString(randomNumber(10, 15)) + '@' + randomString(randomNumber(10, 15)) + '.com'
      case 'uuid':
        return uuidv1()
      case 'uri':
        return 'https://www.' + randomString(randomNumber(10, 15)) + '.com'
      case 'hostname':
        return 'www.' + randomString(randomNumber(10, 15)) + '.com'
      case 'ipv4':
        return randomNumber(1, 9) +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          '.' +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          '.' +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          '.' +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          randomNumber(1, 9)
      case 'ipv6':
        return randomNumber(1, 9) +
          randomNumber(1, 9) +
          ':' +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          ':' +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          '.' +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          ':' +
          randomNumber(1, 9) +
          randomNumber(1, 9) +
          ':' +
          randomNumber(1, 9) +
          randomNumber(1, 9)
    }
  }

  if (schemaPart.enum) {
    return schemaPart.enum[randomNumber(0, schemaPart.enum.length - 1)]
  }

  const minLength = schemaPart.minLength || 0
  const maxLength = schemaPart.maxLength || 100
  return randomString(randomNumber(minLength, maxLength))
}
