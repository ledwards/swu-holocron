import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image';

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

  const getRarityAbbreviation = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'C';
      case 'uncommon':
        return 'U';
      case 'rare':
        return 'R';
      case 'legendary':
        return 'L';
      default:
        return rarity.charAt(0).toUpperCase();
    }
  };

  const getAspectBackgroundColor = (aspects: string[]): string => {
    if (aspects.length === 0) return '#808080'; // Gray for no aspects
    
    const aspectsLower = aspects.map(a => a.toLowerCase());
    const hasVillainy = aspectsLower.includes('villainy');
    const hasHeroism = aspectsLower.includes('heroism');
    
    // Find the primary non-alignment aspect
    const primaryAspect = aspectsLower.find(a => !['villainy', 'heroism'].includes(a)) || aspectsLower[0];
    
    let baseColor: string;
    
    switch (primaryAspect) {
      case 'aggression':
        if (hasVillainy && hasHeroism) return '#DC3545'; // Standard Red
        if (hasVillainy) return '#A02834'; // Darker Red
        if (hasHeroism) return '#F85065'; // Lighter Red
        return '#DC3545'; // Standard Red
      case 'command':
        if (hasVillainy && hasHeroism) return '#28A745'; // Standard Green
        if (hasVillainy) return '#1E7832'; // Darker Green
        if (hasHeroism) return '#40C962'; // Lighter Green
        return '#28A745'; // Standard Green
      case 'vigilance':
        if (hasVillainy && hasHeroism) return '#007BFF'; // Standard Blue
        if (hasVillainy) return '#0056B3'; // Darker Blue
        if (hasHeroism) return '#3395FF'; // Lighter Blue
        return '#007BFF'; // Standard Blue
      case 'cunning':
        if (hasVillainy && hasHeroism) return '#FFC107'; // Standard Yellow
        if (hasVillainy) return '#CC9A06'; // Darker Yellow
        if (hasHeroism) return '#FFD43B'; // Lighter Yellow
        return '#FFC107'; // Standard Yellow
      case 'villainy':
        return '#2C2C2C'; // Dark Gray (not pure black for readability)
      case 'heroism':
        return '#F8F9FA'; // Light Gray (not pure white for visibility)
      default:
        return '#808080'; // Gray fallback
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(card);
    }
  };

  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth * 0.44;
  const imageHeight = 80; // Fixed height to match text area


  const aspectBackgroundColor = getAspectBackgroundColor(card.aspects);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.outerContainer}>
        <View style={styles.cardContainer}>
          <View style={[styles.backgroundLayer, {backgroundColor: aspectBackgroundColor}]} />
          <BlurView intensity={15} tint={theme.name === 'dark' ? 'dark' : 'light'} style={styles.blurContainer}>
            <View style={styles.cardContent}>
              <View style={styles.cardInfo}>
                <Text 
                  style={[
                    styles.cardTitle, 
                    {
                      color: theme.foregroundColor,
                      backgroundColor: 'transparent',
                    }
                  ]} 
                  numberOfLines={1}
                >
                  {card.title}
                </Text>
                {card.subtitle && (
                  <Text 
                    style={[
                      styles.cardSubtitle,
                      {
                        color: theme.foregroundColor,
                        backgroundColor: 'transparent',
                      }
                    ]}
                    numberOfLines={1}
                  >
                    {card.subtitle}
                  </Text>
                )}
                <Text 
                  style={[
                    styles.cardMeta,
                    {
                      color: theme.foregroundColor,
                      backgroundColor: 'transparent',
                    }
                  ]}
                  numberOfLines={1}
                >
                  {`${card.set}${card.number} • ${card.type} • ${getRarityAbbreviation(card.rarity)}`}
                </Text>
              </View>
            </View>
          </BlurView>
          <View style={[styles.cardBorder, {borderColor: theme.dividerColor}]} />
        </View>
        {card.frontArt && (
          <View style={[styles.cardImageContainer, { width: imageWidth }]}>
            <Image
              source={{ uri: card.frontArt }}
              style={[styles.cardImage, { width: imageWidth, height: 80 }]}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    marginLeft: 16,
    marginVertical: 8,
    minHeight: 80,
  },
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 80,
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    opacity: 0.8,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardContent: {
    paddingLeft: 12,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 80,
  },
  cardInfo: {
    flex: 1,
    paddingRight: 8,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 1,
    lineHeight: 18,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    marginBottom: 1,
  },
  cardMeta: {
    fontSize: 10,
    fontWeight: '500',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    opacity: 0.9,
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
  cardImageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});

export default CardListItem;