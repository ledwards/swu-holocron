import '@testing-library/jest-native/extend-expect';

// Basic mocks for testing React Native
jest.mock('expo-font', () => ({
  useFonts: () => [true]
}));

// Silence warnings during tests
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
  ignoreAllLogs: jest.fn(),
}));

// Minimally required mocks for tests to run
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    // Add any minimal mocks needed here
    NativeModules: {
      ...RN.NativeModules,
      StatusBarManager: { getHeight: jest.fn() }
    },
    Alert: { alert: jest.fn() }
  };
});

// Ignore specific console messages
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && args[0].includes && args[0].includes('Each child in a list should have a unique "key" prop')) {
    return;
  }
  originalConsoleError(...args);
};