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
}

const CardList: React.FC<CardListProps> = ({onCardPress}) => {
  const [loading, setLoading] = useState(false);

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
        Star Wars Unlimited Cards
      </Text>
      <Text style={[styles.defaultTextDescription, {color: theme.foregroundColor}]}>
        Browse all Star Wars Unlimited cards
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
        data={allCards}
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
