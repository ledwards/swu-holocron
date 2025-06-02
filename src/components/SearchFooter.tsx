import React, {useContext, useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Keyboard, Animated, Text} from 'react-native';
import {BlurView} from 'expo-blur';
import {Icon} from 'react-native-elements';
import ThemeContext from '../contexts/ThemeContext';
import {Theme} from '../types/interfaces';
import layout from '../constants/layout';

interface SearchFooterProps {
  onSearchChange?: (text: string) => void;
  onToggleSearchMode?: () => void;
  resultCount?: number;
  searchTerm?: string;
  activeTab?: string;
  currentResult?: number;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
}

const SearchFooter: React.FC<SearchFooterProps> = ({
  onSearchChange,
  onToggleSearchMode,
  resultCount = 0,
  searchTerm = '',
  activeTab = 'Cards',
  currentResult = 0,
  onNavigateNext,
  onNavigatePrev,
}) => {
  const [searchText, setSearchText] = useState('');
  const [keyboardHeight] = useState(new Animated.Value(0));
  const themeContext = useContext(ThemeContext);
  const theme: Theme = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)',
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearchChange?.(text);
  };

  const clearSearch = () => {
    setSearchText('');
    onSearchChange?.('');
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      (event) => {
        // Adjust keyboard height to provide equal margin above and below search box
        const adjustedHeight = event.endCoordinates.height - layout.tabBarHeight() - 15;
        Animated.timing(keyboardHeight, {
          toValue: adjustedHeight,
          duration: event.duration,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      (event) => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: event.duration,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [keyboardHeight]);

  return (
    <Animated.View style={[styles.footerContainer, { bottom: keyboardHeight }]}>
      <BlurView
        style={[
          styles.blurBackground,
          {
            height: layout.nativeFooterHeight() + layout.tabBarHeight() + layout.searchBarHeight() + (searchTerm.length > 0 ? 60 : 30),
          },
        ]}
        intensity={50}
        tint={theme.name === 'dark' ? 'dark' : 'light'}
      />
      <View style={styles.searchContainer}>
        {searchTerm.length > 0 && (
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: theme.foregroundColor }]}>
              {resultCount === 0 
                ? activeTab === 'RulesTab' ? `No results found for "${searchTerm}"` : `No cards match "${searchTerm}"`
                : `${resultCount} result${resultCount !== 1 ? 's' : ''} found for "${searchTerm}"`
              }
            </Text>
          </View>
        )}
        <View style={[styles.searchInputContainer, {borderColor: theme.dividerColor}]}>
          <TextInput
            style={[
              styles.searchInput,
              {
                color: theme.foregroundColor,
              },
            ]}
            placeholder={activeTab === 'RulesTab' ? "Search rules..." : "Search cards..."}
            placeholderTextColor={theme.foregroundColor + '80'}
            value={searchText}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            autoCorrect={false}
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <View style={styles.searchActions}>
              {activeTab === 'RulesTab' && resultCount > 0 && onNavigateNext && onNavigatePrev && (
                <>
                  <Text style={[styles.searchResultsText, { color: theme.foregroundColor }]}>
                    {currentResult}/{resultCount}
                  </Text>
                  <TouchableOpacity onPress={onNavigatePrev} style={styles.searchNavButton}>
                    <Icon
                      name="chevron-up"
                      type="ionicon"
                      size={18}
                      color={theme.foregroundColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onNavigateNext} style={styles.searchNavButton}>
                    <Icon
                      name="chevron-down"
                      type="ionicon"
                      size={18}
                      color={theme.foregroundColor}
                    />
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity onPress={clearSearch} style={styles.filterButton}>
                <Icon
                  name="close"
                  type="ionicon"
                  size={20}
                  color={theme.foregroundColor}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  blurBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: 'absolute',
    bottom: 44,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  statusContainer: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  filterButton: {
    marginLeft: 8,
    padding: 4,
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchResultsText: {
    fontSize: 14,
    marginRight: 4,
  },
  searchNavButton: {
    padding: 4,
  },
});

export default SearchFooter;