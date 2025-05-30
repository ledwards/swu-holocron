import React, {useContext, useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {BlurView} from 'expo-blur';
import {Icon} from 'react-native-elements';
import ThemeContext from '../contexts/ThemeContext';
import {Theme} from '../types/interfaces';
import layout from '../constants/layout';

interface SearchFooterProps {
  onSearchChange?: (text: string) => void;
  onToggleSearchMode?: () => void;
}

const SearchFooter: React.FC<SearchFooterProps> = ({
  onSearchChange,
  onToggleSearchMode,
}) => {
  const [searchText, setSearchText] = useState('');
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

  return (
    <View style={styles.footerContainer}>
      <BlurView
        style={[
          styles.blurBackground,
          {
            height: layout.nativeFooterHeight() + layout.tabBarHeight() + layout.searchBarHeight() + 20,
          },
        ]}
        intensity={50}
        tint={theme.name === 'dark' ? 'dark' : 'light'}
      />
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, {borderColor: theme.dividerColor}]}>
          <TextInput
            style={[
              styles.searchInput,
              {
                color: theme.foregroundColor,
              },
            ]}
            placeholder="Search cards..."
            placeholderTextColor={theme.foregroundColor + '80'}
            value={searchText}
            onChangeText={handleSearchChange}
            returnKeyType="search"
          />
          {searchText.length > 0 ? (
            <TouchableOpacity onPress={clearSearch} style={styles.filterButton}>
              <Icon
                name="close"
                type="ionicon"
                size={20}
                color={theme.foregroundColor}
              />
            </TouchableOpacity>
          ) : (
            onToggleSearchMode && (
              <TouchableOpacity onPress={onToggleSearchMode} style={styles.filterButton}>
                <Icon
                  name="options-outline"
                  type="ionicon"
                  size={20}
                  color={theme.foregroundColor}
                />
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </View>
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
});

export default SearchFooter;