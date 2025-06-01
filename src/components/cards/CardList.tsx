import React, {useState, useEffect, useContext, useRef, useCallback, JSX} from 'react';
import {View, ActivityIndicator, Text, FlatList} from 'react-native';

import CardListItem  from './CardListItem';
import Card from '../../models/Card';

import styles from '../../styles/SearchableCardListStyles';
import layout from '../../constants/layout';
import AllCardsContext from '../../contexts/AllCardsContext';
import ThemeContext from '../../contexts/ThemeContext';
import {Theme, ScrollToIndexFunction} from '../../types/interfaces';

interface CardListProps {
  onCardPress?: (card: Card) => void;
  searchQuery?: string;
}

const CardList: React.FC<CardListProps> = ({onCardPress, searchQuery = ''}) => {
  const [loading, setLoading] = useState(false);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);

  const flatListRef = useRef<FlatList<Card>>(null);

  const themeContext = useContext(ThemeContext);
  const theme: Theme = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)'
  };

  const allCardsContext = useContext(AllCardsContext);
  const allCards: Card[] = allCardsContext || [];

  // Helper function to check if a word is found as a whole word in text
  const isWholeWord = (text: string, word: string): boolean => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(text);
  };

  // Calculate relevance score for a card based on search query
  const calculateRelevance = (card: Card, searchText: string): number => {
    let score = 0;
    const search = searchText.toLowerCase().trim();
    
    // If no search text, return 0
    if (!search) return 0;
    
    // Check title (highest weight)
    if (card.title.toLowerCase().includes(search)) {
      score += card.title.toLowerCase() === search ? 1000 : 500; // Exact match gets higher score
    }
    
    // Check subtitle (high weight)
    if (card.subtitle && card.subtitle.toLowerCase().includes(search)) {
      score += card.subtitle.toLowerCase() === search ? 800 : 400;
    }
    
    return score;
  };

  // Filter and sort cards based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCards(allCards);
      return;
    }

    const searchText = searchQuery.toLowerCase().trim();
    
    // Filter cards that match the search and calculate relevance scores
    const cardsWithScores = allCards
      .map(card => ({
        card,
        score: calculateRelevance(card, searchText)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score) // Sort by relevance score (highest first)
      .map(item => item.card); // Extract just the cards

    setFilteredCards(cardsWithScores);
  }, [searchQuery, allCards]);

  const scrollToIndex: ScrollToIndexFunction = (index: number): void => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: index,
        viewOffset: layout.nativeHeaderHeight() + 75,
      });
    }
  };

  const renderCard = ({item, index}: {item: Card; index: number}) => {
    return (
      <CardListItem
        theme={theme}
        card={item}
        index={index}
        scrollToIndex={scrollToIndex}
        onPress={onCardPress}
      />
    );
  };

  const keyExtractor = (item: Card) => item.id || `${item.set}-${item.number}`;

  const renderEmptyComponent = () => (
    <View style={styles.listEmptyContainer}>
      <Text style={[styles.defaultTextTitle, {color: theme.foregroundColor}]}>
        {searchQuery ? 'No Results Found' : 'Star Wars Unlimited Cards'}
      </Text>
      <Text style={[styles.defaultTextDescription, {color: theme.foregroundColor}]}>
        {searchQuery ? `No cards match "${searchQuery}"` : 'Browse all Star Wars Unlimited cards'}
      </Text>
    </View>
  );

  const SeparatorComponent = (): JSX.Element => {
    return (
      <View
        style={{
          backgroundColor: theme.backgroundColor,
          ...styles.separator,
        }}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[{backgroundColor: theme.backgroundColor, flex: 1}]}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.flatListContentContainer}
        data={filteredCards}
        renderItem={renderCard}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={() => <></>}
        ListHeaderComponentStyle={{
          backgroundColor: theme.backgroundColor,
          borderColor: 'transparent',
          borderBottomWidth: 0,
          height: layout.nativeHeaderHeight(),
        }}
        ListFooterComponent={() => <></>}
        ListFooterComponentStyle={{
          flexGrow: 1,
          backgroundColor: theme.backgroundColor,
          height: layout.footerHeight(layout.tabBarHeight(), undefined),
          borderTopWidth: 0,
          borderColor: 'transparent',
        }}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={SeparatorComponent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default CardList;
