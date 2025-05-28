import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Collapsible } from '../../components/Collapsible';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';

// Mock dependencies
jest.mock('../../hooks/useColorScheme', () => ({
  __esModule: true,
  useColorScheme: jest.fn(),
}));

// Mock the IconSymbol component
jest.mock('../../components/ui/IconSymbol', () => ({
  IconSymbol: ({ style, ...props }) => {
    // Return a mock component that can be tested
    return (
      <mock-icon-symbol
        testID="icon-symbol"
        {...props}
        style={style ? JSON.stringify(style) : undefined}
      />
    );
  },
}));

describe('Collapsible', () => {
  beforeEach(() => {
    // Default to light theme
    useColorScheme.mockReturnValue('light');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the correct title', () => {
    const title = 'Collapsible Section';
    const { getByText } = render(
      <Collapsible title={title}>
        <mock-child />
      </Collapsible>
    );
    
    expect(getByText(title)).toBeTruthy();
  });

  it('does not show content initially', () => {
    const { queryByTestId } = render(
      <Collapsible title="Test Collapsible">
        <mock-child data-testid="child-content" />
      </Collapsible>
    );
    
    // Content should not be visible initially
    expect(queryByTestId('child-content')).toBeNull();
  });

  it('shows content when clicked', () => {
    const { getByText, queryByTestId } = render(
      <Collapsible title="Test Collapsible">
        <mock-child data-testid="child-content" />
      </Collapsible>
    );
    
    // Click the header to expand
    fireEvent.press(getByText('Test Collapsible').parent);
    
    // Content should now be visible
    expect(queryByTestId('child-content')).toBeTruthy();
  });

  it('toggles content visibility when clicked multiple times', () => {
    const { getByText, queryByTestId } = render(
      <Collapsible title="Test Collapsible">
        <mock-child data-testid="child-content" />
      </Collapsible>
    );
    
    const header = getByText('Test Collapsible').parent;
    
    // Initially closed
    expect(queryByTestId('child-content')).toBeNull();
    
    // First click - should open
    fireEvent.press(header);
    expect(queryByTestId('child-content')).toBeTruthy();
    
    // Second click - should close
    fireEvent.press(header);
    expect(queryByTestId('child-content')).toBeNull();
  });

  it('uses the correct icon color for light theme', () => {
    useColorScheme.mockReturnValue('light');
    
    const { getByTestId } = render(
      <Collapsible title="Test Collapsible">
        <mock-child />
      </Collapsible>
    );
    
    const icon = getByTestId('icon-symbol');
    expect(icon.props.color).toBe(Colors.light.icon);
  });

  it('uses the correct icon color for dark theme', () => {
    useColorScheme.mockReturnValue('dark');
    
    const { getByTestId } = render(
      <Collapsible title="Test Collapsible">
        <mock-child />
      </Collapsible>
    );
    
    const icon = getByTestId('icon-symbol');
    expect(icon.props.color).toBe(Colors.dark.icon);
  });

  it('rotates the icon when expanded', () => {
    const { getByText, getByTestId } = render(
      <Collapsible title="Test Collapsible">
        <mock-child />
      </Collapsible>
    );
    
    // Initially the icon should not be rotated
    const initialIcon = getByTestId('icon-symbol');
    const initialStyle = JSON.parse(initialIcon.props.style);
    expect(initialStyle.transform[0].rotate).toBe('0deg');
    
    // Click to expand
    fireEvent.press(getByText('Test Collapsible').parent);
    
    // After expanding, the icon should be rotated
    const expandedIcon = getByTestId('icon-symbol');
    const expandedStyle = JSON.parse(expandedIcon.props.style);
    expect(expandedStyle.transform[0].rotate).toBe('90deg');
  });
});