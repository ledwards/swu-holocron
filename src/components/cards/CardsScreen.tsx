import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import ThemeContext from '../../contexts/ThemeContext';
import {Theme} from '../../types/interfaces';
import CardList from './CardList';
import Card from '../../models/Card';

const CardsScreen = () => {
  const themeContext = useContext(ThemeContext);
  const theme: Theme = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)',
  };

  const handleCardPress = (card: Card) => {
    console.log('Card pressed:', card.displayTitle);
    // TODO: Navigate to card detail view
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <CardList onCardPress={handleCardPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CardsScreen;