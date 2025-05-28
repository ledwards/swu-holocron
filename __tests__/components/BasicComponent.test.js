import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Sample component to test
const BasicComponent = ({ message }) => (
  <View testID="basic-component">
    <Text testID="message-text">{message}</Text>
  </View>
);

describe('BasicComponent', () => {
  it('renders correctly with the provided message', () => {
    const message = 'Hello, Testing!';
    const { getByTestId, getByText } = render(<BasicComponent message={message} />);
    
    // Check if component renders
    const component = getByTestId('basic-component');
    expect(component).toBeTruthy();
    
    // Check if message is displayed correctly
    const messageText = getByTestId('message-text');
    expect(messageText).toBeTruthy();
    expect(getByText(message)).toBeTruthy();
  });

  it('handles empty message', () => {
    const { getByTestId } = render(<BasicComponent message="" />);
    
    // Component should still render with empty message
    const component = getByTestId('basic-component');
    expect(component).toBeTruthy();
    
    const messageText = getByTestId('message-text');
    expect(messageText.props.children).toBe('');
  });
});