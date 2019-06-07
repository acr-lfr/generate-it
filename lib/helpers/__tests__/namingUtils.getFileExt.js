const getfileExt = require('../namingUtils').getFileExt

it('should return js from a simple js file name', () => {
  expect(getfileExt('hello/world.js')).toBe('js')
})

it('should return js from a js.njk file name', () => {
  expect(getfileExt('hello/world.js.njk')).toBe('js')
})

it('should return json from a json.njk file name', () => {
  expect(getfileExt('hello/world.json.njk')).toBe('json')
})
