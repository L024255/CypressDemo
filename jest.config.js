module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js"],
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  preset: "ts-jest/presets/js-with-babel",
  moduleFileExtensions: ["ts", "tsx", "js"],
  watchPathIgnorePatterns: ["(/build/.*)", "(/__mocks__/.*)"],
  testPathIgnorePatterns: ["(/build/.*)"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 90,
    },
  },
};
