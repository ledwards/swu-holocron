import React, {useContext} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import {BlurView} from 'expo-blur';

import ThemeContext from '../../contexts/ThemeContext';
import AllCardsContext from '../../contexts/AllCardsContext';
import {Theme} from '../../types/interfaces';
import Card from '../../models/Card';
import CardListItem from './CardListItem';
import layout from '../../constants/layout';

interface CardListProps {
  onCardPress?: (card: Card) => void;
}

const CardList: React.FC<CardListProps> = ({onCardPress}) => {
  const themeContext = useContext(ThemeContext);
  const allCards = useContext(AllCardsContext);
  const theme: Theme = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)',
  };

  const renderCard = ({item}: {item: Card}) => (
    <CardListItem card={item} onPress={onCardPress} />
  );

  const keyExtractor = (item: Card) => item.id || `${item.set}-${item.number}`;

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, {color: theme.foregroundColor}]}>
        No cards available
      </Text>
      <Text style={[styles.emptySubtext, {color: theme.foregroundColor}]}>
        Cards are still loading or there was an error loading the card data.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.backgroundPattern, {backgroundColor: theme.backgroundColor}]} />
      <BlurView intensity={5} tint={theme.name === 'dark' ? 'dark' : 'light'} style={styles.backgroundBlur} />
      <FlatList
        data={allCards}
        renderItem={renderCard}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[
          styles.listContainer,
          {
            paddingTop: layout.nativeHeaderHeight() + 16,
            paddingBottom: layout.footerHeight(layout.tabBarHeight(), undefined) + 16,
          },
          allCards.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        windowSize={8}
        initialNumToRender={15}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 140,
          offset: 140 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  backgroundBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});

export default CardList;