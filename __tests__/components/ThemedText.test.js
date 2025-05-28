import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../../components/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';

// Mock the useThemeColor hook
jest.mock('../../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

describe('ThemedText', () => {
  beforeEach(() => {
    // Reset the mock before each test
    useThemeColor.mockClear();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(<ThemedText>Test Text</ThemedText>);
    
    expect(getByText('Test Text')).toBeTruthy();
    expect(useThemeColor).toHaveBeenCalledWith(
      { light: undefined, dark: undefined },
      'text'
    );
  });

  it('uses custom colors when provided', () => {
    const { getByText } = render(
      <ThemedText lightColor="#ffffff" darkColor="#000000">
        Custom Color Text
      </ThemedText>
    );
    
    expect(getByText('Custom Color Text')).toBeTruthy();
    expect(useThemeColor).toHaveBeenCalledWith(
      { light: '#ffffff', dark: '#000000' },
      'text'
    );
  });

  it('applies title style correctly', () => {
    const { getByText } = render(
      <ThemedText type="title">Title Text</ThemedText>
    );
    
    const textElement = getByText('Title Text');
    expect(textElement).toBeTruthy();
    
    // Check if style properties are applied
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 32,
          fontWeight: 'bold',
          lineHeight: 32,
        })
      ])
    );
  });

  it('applies subtitle style correctly', () => {
    const { getByText } = render(
      <ThemedText type="subtitle">Subtitle Text</ThemedText>
    );
    
    const textElement = getByText('Subtitle Text');
    expect(textElement).toBeTruthy();
    
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 20,
          fontWeight: 'bold',
        })
      ])
    );
  });

  it('applies defaultSemiBold style correctly', () => {
    const { getByText } = render(
      <ThemedText type="defaultSemiBold">SemiBold Text</ThemedText>
    );
    
    const textElement = getByText('SemiBold Text');
    expect(textElement).toBeTruthy();
    
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 16,
          fontWeight: '600',
          lineHeight: 24,
        })
      ])
    );
  });

  it('applies link style correctly', () => {
    const { getByText } = render(
      <ThemedText type="link">Link Text</ThemedText>
    );
    
    const textElement = getByText('Link Text');
    expect(textElement).toBeTruthy();
    
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 16,
          lineHeight: 30,
          color: '#0a7ea4',
        })
      ])
    );
  });

  it('applies custom styles correctly', () => {
    const customStyle = { margin: 10, padding: 5 };
    const { getByText } = render(
      <ThemedText style={customStyle}>Custom Styled Text</ThemedText>
    );
    
    const textElement = getByText('Custom Styled Text');
    expect(textElement).toBeTruthy();
    
    // Check if custom style is applied along with default styles
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        customStyle
      ])
    );
  });
});