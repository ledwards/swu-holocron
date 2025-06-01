import React, {useState, useEffect, useContext, useRef} from 'react';
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
    const searchWords = searchText.toLowerCase().split(' ').filter(word => word.length > 0);
    

    
    // Bonus for matching multiple words
    const multiWordBonus = searchWords.length > 1 ? searchWords.length * 5 : 0;
    
    searchWords.forEach((word, index) => {
      // Earlier words in search query get slight priority
      const positionMultiplier = 1 + (searchWords.length - index) * 0.1;
      let wordScore = 0;
      
      // Title matches (highest priority)
      const title = card.title.toLowerCase();
      if (title === searchText) { 
        wordScore += (200 * positionMultiplier);
      }
      else if (title === word) { 
        wordScore += (100 * positionMultiplier);
      }
      else if (title.startsWith(word + ' ') || title === word) { 
        wordScore += (90 * positionMultiplier);
      }
      else if (isWholeWord(title, word)) { 
        wordScore += (80 * positionMultiplier);
      }
      else if (title.includes(word) && word.length >= 3) { 
        wordScore += (60 * positionMultiplier);
      }
      
      // Subtitle matches (high priority)
      const subtitle = (card.subtitle || '').toLowerCase();
      if (subtitle === searchText) {
        wordScore += (140 * positionMultiplier);
      }
      else if (subtitle === word) {
        wordScore += (70 * positionMultiplier);
      }
      else if (subtitle.startsWith(word + ' ') || subtitle === word) {
        wordScore += (60 * positionMultiplier);
      }
      else if (isWholeWord(subtitle, word)) {
        wordScore += (50 * positionMultiplier);
      }
      else if (subtitle.includes(word) && word.length >= 3) {
        wordScore += (30 * positionMultiplier);
      }
      
      // Type matches (medium priority) - only exact or whole word matches
      const type = card.type.toLowerCase();
      if (type === word) {
        wordScore += (40 * positionMultiplier);
      }
      else if (isWholeWord(type, word)) {
        wordScore += (20 * positionMultiplier);
      }
      
      // Traits matches (medium priority) - only exact or whole word matches
      const traits = (card.traits || []).map(t => t.toLowerCase());
      traits.forEach(trait => {
        if (trait === word) {
          wordScore += (35 * positionMultiplier);
        }
        else if (isWholeWord(trait, word)) {
          wordScore += (15 * positionMultiplier);
        }
      });
      
      // Aspects matches (medium priority) - only exact or whole word matches
      const aspects = (card.aspects || []).map(a => a.toLowerCase());
      aspects.forEach(aspect => {
        if (aspect === word) {
          wordScore += (35 * positionMultiplier);
        }
        else if (isWholeWord(aspect, word)) {
          wordScore += (15 * positionMultiplier);
        }
      });
      
      // Set matches - only exact matches to avoid false positives
      const set = card.set.toLowerCase();
      if (set === word) {
        wordScore += (25 * positionMultiplier);
      }
      
      // Text matches (lower priority) - only whole words
      const text = (card.text || '').toLowerCase();
      if (isWholeWord(text, word)) {
        wordScore += (15 * positionMultiplier);
      }
      
      // Other fields - only exact matches
      if (card.rarity.toLowerCase() === word) {
        wordScore += (10 * positionMultiplier);
      }
      if (card.artist?.toLowerCase() === word) {
        wordScore += (10 * positionMultiplier);
      }
      
      const arenas = (card.arenas || []).map(a => a.toLowerCase());
      arenas.forEach(arena => {
        if (arena === word) {
          wordScore += (10 * positionMultiplier);
        }
      });
      
      score += wordScore;
    });
    
    // Add multi-word bonus if applicable
    score += multiWordBonus;
    
    // Bonus for unique cards (they're often more sought after)
    if (card.unique) score += 5;
    
    const finalScore = Math.round(score);
    

    
    // Ensure we only return scores > 0
    return finalScore > 0 ? finalScore : 0;
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
