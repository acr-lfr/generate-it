const TemplateFetch = require('../TemplateFetch')

describe('should return valid directory', () => {
  it('camelcase a url and map to directory', () => {
    const directory = TemplateFetch.calculateLocalDirectoryFromUrl('https://github.com/acrontum/openapi-nodegen.git')
    const expected = process.cwd() + '/node_modules/openapi-nodegen/cache/httpsGithubComAcrontumOpenapi-nodegenGit'
    expect(directory).toBe(expected)
  })
})
