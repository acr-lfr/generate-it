module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'rules': {
    'no-console': 'off',
    'arrow-parens': 'error',
    'curly': 'error',
    'brace-style': 'error',
    'camelcase': ['error', { properties: 'never' }]
  }
}
