import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import CardsScreen from './CardsScreen';
import SearchFooter from '../SearchFooter';
import SearchContext from '../../contexts/SearchContext';

const CardsScreenWithSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, resultCount, setResultCount }}>
      <View style={styles.container}>
        <CardsScreen />
        <SearchFooter 
          onSearchChange={setSearchQuery}
          onToggleSearchMode={() => {
            // TODO: Handle search mode toggle
          }}
          resultCount={resultCount}
          searchTerm={searchQuery}
        />
      </View>
    </SearchContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CardsScreenWithSearch;