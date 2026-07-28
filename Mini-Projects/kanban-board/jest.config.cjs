/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@lib/(.*)$': '<rootDir>/../react-ui-system/src/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/../react-ui-system/src/hooks/$1',
    '^@internal/ui-system$': '<rootDir>/../react-ui-system/src/index.ts'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/e2e/']
};
