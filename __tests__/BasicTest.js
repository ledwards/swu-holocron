import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

describe('Basic Test', () => {
  test('renders correctly', () => {
    const testMessage = 'Hello, World!';
    const TestComponent = () => (
      <View testID="test-view">
        <Text testID="test-text">{testMessage}</Text>
      </View>
    );

    const { getByTestID, getByText } = render(<TestComponent />);
    
    // Test that the component renders
    expect(getByText(testMessage)).toBeTruthy();
  });

  test('basic logic works', () => {
    // Simple test to verify Jest is working
    expect(1 + 1).toBe(2);
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect('Hello').toEqual('Hello');
  });
});