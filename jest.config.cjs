/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/resources/js/src/setupTests.js'],
  moduleNameMapper: {
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle static assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub',
    // Handle alias resolution for @ imports
    '^@/(.*)$': '<rootDir>/resources/js/src/$1',
    // Handle relative imports from src directory
    '^~/(.*)$': '<rootDir>/resources/js/src/$1',
    // Handle component imports
    '^components/(.*)$': '<rootDir>/resources/js/src/components/$1',
    '^context/(.*)$': '<rootDir>/resources/js/src/context/$1',
    '^services/(.*)$': '<rootDir>/resources/js/src/services/$1',
    '^utils/(.*)$': '<rootDir>/resources/js/src/utils/$1',
    '^Pages/(.*)$': '<rootDir>/resources/js/src/Pages/$1'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-stub'
  },
  testMatch: [
    '<rootDir>/resources/js/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/resources/js/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'resources/js/src/**/*.{js,jsx,ts,tsx}',
    '!resources/js/src/**/*.d.ts',
    '!resources/js/src/index.js',
    '!resources/js/src/main.jsx',
    '!resources/js/src/setupTests.js',
    '!resources/js/src/**/__mocks__/**',
    '!resources/js/src/**/__tests__/**',
    '!resources/js/src/**/index.{js,jsx,ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleDirectories: ['node_modules', '<rootDir>/resources/js/src', '<rootDir>/resources/js'],
  testPathIgnorePatterns: ['/node_modules/', '/vendor/', '/storage/', '/bootstrap/'],
  transformIgnorePatterns: [
    'node_modules/(?!(axios|@testing-library|react-router-dom|@react-google-maps)/)',
  ],
  // Handle ES modules properly
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  // Verbose output for better debugging
  verbose: true,
  // Handle async operations
  testTimeout: 10000,
  // Better error reporting
  errorOnDeprecated: true,
  // Handle React 18 features
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  }
};