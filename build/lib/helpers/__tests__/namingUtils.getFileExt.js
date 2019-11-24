const getfileExt = require('../NamingUtils').getFileExt;
it('should return js from a simple js file name', () => {
    expect(getfileExt('hello/world.js')).toBe('js');
});
it('should return js from a js.njk file name', () => {
    expect(getfileExt('hello/world.js.njk')).toBe('js');
});
it('should return spec.js from file name', () => {
    expect(getfileExt('tests/world.spec.js.njk')).toBe('spec.js');
});
it('should return spec.js from file name', () => {
    expect(getfileExt('tests/world.spec.js')).toBe('spec.js');
});
