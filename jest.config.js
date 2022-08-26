const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  // Automatically reset mock calls, instances, contexts and results before every test
  resetMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/__tests__/test_utils/',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The root directory that Jest should scan for tests and modules within
  rootDir: process.cwd(),

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },

  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[tj]s?(x)',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/__tests__/test_utils/',
  ],

  moduleNameMapper: {
    ...(pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/src/',
    }) || {}),
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },

  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'web.ts',
    'web.tsx',
    'web.js',
    'web.jsx',
    'json',
    'node',
  ],

  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
