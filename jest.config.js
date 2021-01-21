const ignore = [
  '/.openapi-nodegen/',
  '/node_modules/',
  '/build/',
  '/dist/',
];

module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'ts',
    'tsx'
  ],

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coverageDirectory: 'coverage',

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: ignore,
  testPathIgnorePatterns: ignore,
  modulePathIgnorePatterns: ignore,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/__tests__/*.ts',
  ],

  setupFilesAfterEnv: ['./jest.setup.js'],

  testURL: 'http://localhost/',
}
