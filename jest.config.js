module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'public/**/*.js',
    '!public/**/*.test.js',
    '!public/test.html'
  ],
  transform: {},
  verbose: true
};

