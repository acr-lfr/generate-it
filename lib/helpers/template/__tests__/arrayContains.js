const arrayContains = require('../arrayContains.js')

it('Should return true for an exact match', () => {
  expect(arrayContains('bob', ['tim', 'bob'])).toBe(true)
})

it('Should return true for a loose match', () => {
  expect(arrayContains('ob', ['tim', 'bob'])).toBe(true)
})

it('Should return false for a loose match', () => {
  expect(arrayContains('car', ['tim', 'bob'])).toBe(false)
})
