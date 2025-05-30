import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BlurView} from 'expo-blur';

import ThemeContext from '../../contexts/ThemeContext';
import {Theme} from '../../types/interfaces';
import Card from '../../models/Card';
import colors from '../../styles/colors';

interface CardListItemProps {
  card: Card;
  onPress?: (card: Card) => void;
}

const CardListItem: React.FC<CardListItemProps> = ({card, onPress}) => {
  const themeContext = useContext(ThemeContext);
  const theme: Theme = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)',
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return colors.common;
      case 'uncommon':
        return colors.uncommon;
      case 'rare':
        return colors.rare;
      case 'legendary':
        return colors.legendary;
      default:
        return colors.gray;
    }
  };

  const getSetDisplayName = (set: string): string => {
    const setMap: {[key: string]: string} = {
      'SOR': 'Spark of Rebellion',
      'SOG': 'Shadows of the Galaxy',
      'TWI': 'Twilight of the Republic',
      'HYP': 'Jump to Lightspeed',
    };
    return setMap[set] || set;
  };

  const getTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'unit':
        return colors.unit;
      case 'event':
        return colors.green;
      case 'upgrade':
        return colors.orange;
      case 'base':
        return colors.darkBlue;
      case 'leader':
        return colors.yellow;
      default:
        return colors.gray;
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(card);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.cardContainer}>
        <View style={[styles.backgroundLayer, {backgroundColor: theme.translucentBackgroundColor}]} />
        <BlurView intensity={15} tint={theme.name === 'dark' ? 'dark' : 'light'} style={styles.blurContainer}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, {color: theme.foregroundColor}]} numberOfLines={1}>
                {card.displayTitle}
              </Text>
              <View style={styles.cardMeta}>
                <Text style={[styles.setNumber, {color: theme.foregroundColor}]}>
                  {getSetDisplayName(card.set)} #{card.number}
                </Text>
              </View>
            </View>
            
            <View style={styles.cardDetails}>
              <View style={styles.typeContainer}>
                <View style={[styles.typeBadge, {backgroundColor: getTypeColor(card.type)}]}>
                  <Text style={styles.typeText}>{card.type}</Text>
                </View>
                <View style={[styles.rarityBadge, {backgroundColor: getRarityColor(card.rarity)}]}>
                  <Text style={styles.rarityText}>{card.rarity}</Text>
                </View>
              </View>
              
              {card.aspects.length > 0 && (
                <View style={styles.aspectsContainer}>
                  {card.aspects.map((aspect, index) => (
                    <View key={index} style={[styles.aspectBadge, {borderColor: theme.dividerColor}]}>
                      <Text style={[styles.aspectText, {color: theme.foregroundColor}]}>{aspect}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              {(card.cost !== undefined && card.cost !== null) || 
               (card.power !== undefined && card.power !== null) || 
               (card.hp !== undefined && card.hp !== null) ? (
                <View style={styles.statsContainer}>
                  {(card.cost !== undefined && card.cost !== null) && (
                    <View style={styles.statItem}>
                      <Text style={[styles.statLabel, {color: theme.foregroundColor}]}>Cost:</Text>
                      <Text style={[styles.statValue, {color: colors.yellow}]}>{card.cost}</Text>
                    </View>
                  )}
                  {(card.power !== undefined && card.power !== null) && (
                    <View style={styles.statItem}>
                      <Text style={[styles.statLabel, {color: theme.foregroundColor}]}>Power:</Text>
                      <Text style={[styles.statValue, {color: colors.red}]}>{card.power}</Text>
                    </View>
                  )}
                  {(card.hp !== undefined && card.hp !== null) && (
                    <View style={styles.statItem}>
                      <Text style={[styles.statLabel, {color: theme.foregroundColor}]}>HP:</Text>
                      <Text style={[styles.statValue, {color: colors.green}]}>{card.hp}</Text>
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          </View>
        </BlurView>
        <View style={[styles.cardBorder, {borderColor: theme.dividerColor}]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 124,
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    opacity: 0.8,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  cardMeta: {
    alignItems: 'flex-end',
  },
  setNumber: {
    fontSize: 11,
    opacity: 0.7,
    fontWeight: '500',
    textAlign: 'right',
  },
  cardDetails: {
    gap: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rarityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  aspectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  aspectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  aspectText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: 12,
    opacity: 0.3,
  },
});

export default CardListItem;