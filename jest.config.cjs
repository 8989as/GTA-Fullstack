/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/resources/js/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '<rootDir>/resources/js/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/resources/js/src/**/*.{test,spec}.{js,jsx}'
  ],
  collectCoverageFrom: [
    'resources/js/src/**/*.{js,jsx}',
    '!resources/js/src/**/*.d.ts',
    '!resources/js/src/index.js',
    '!resources/js/src/setupTests.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleDirectories: ['node_modules', '<rootDir>/resources/js/src'],
  testPathIgnorePatterns: ['/node_modules/', '/vendor/'],
  transformIgnorePatterns: [
    'node_modules/(?!(axios|@testing-library)/)',
  ]
};