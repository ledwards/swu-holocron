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
    
    // Find the primary aspect
    const primaryAspect = aspectsLower.find(a => !['villainy', 'heroism'].includes(a)) || aspectsLower[0];
    
    switch (primaryAspect) {
      case 'aggression':
        return '#D25A56'; // More vibrant muted red
      case 'command':
        return '#2B4C36'; // Muted dark green
      case 'vigilance':
        return '#2C3E5C'; // Muted dark blue
      case 'cunning':
        return '#E6C547'; // More vibrant muted yellow
      case 'villainy':
        return '#1A1A1A'; // Dark gray
      case 'heroism':
        return '#D8D8D8'; // Muted light gray
      default:
        return '#4A4A4A'; // Medium gray
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

  // Get card type-specific content position for viewport into artwork
  const getContentPosition = (cardType: string) => {
    const type = cardType.toLowerCase();
    
    switch (type) {
      case 'unit':
        // Check if unit is a vehicle and adjust accordingly
        const isVehicle = card.traits.some(trait => trait.toLowerCase().includes('vehicle'));
        return { 
          top: isVehicle ? '27%' : '17%', 
          left: '15%' 
        }; // Show lower section for vehicles, standard for other units
      case 'upgrade':
        return { top: '15%', left: '15%' }; // Standard positioning
      case 'event':
        return { top: '70%', left: '15%' }; // Show lower half for events
      case 'leader':
        return { top: '15%', left: '15%' }; // Standard positioning
      case 'base':
        return { top: '20%', left: '15%' }; // Move down 5% for bases
      default:
        return { top: '15%', left: '15%' }; // Standard positioning
    }
  };

  const contentPosition = getContentPosition(card.type);
  const aspectBackgroundColor = getAspectBackgroundColor(card.aspects);
  
  // Use black text for light backgrounds, white text for dark backgrounds
  const getTextColor = (backgroundColor: string): string => {
    if (backgroundColor === '#D8D8D8') return '#000000'; // Black text on light gray
    return '#FFFFFF'; // White text on all dark colors
  };
  
  const textColor = getTextColor(aspectBackgroundColor);

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
                      color: textColor,
                      backgroundColor: 'transparent',
                    }
                  ]} 
                  numberOfLines={1}
                >
                  {card.title}
                </Text>
                <Text 
                  style={[
                    styles.cardSubtitle,
                    {
                      color: textColor,
                      backgroundColor: 'transparent',
                    }
                  ]}
                  numberOfLines={1}
                >
                  {card.subtitle || ' '}
                </Text>
                <Text 
                  style={[
                    styles.cardMeta,
                    {
                      color: textColor,
                      backgroundColor: 'transparent',
                    }
                  ]}
                  numberOfLines={1}
                >
                  {`${card.set} ${card.number} • ${card.type} • ${getRarityAbbreviation(card.rarity)}`}
                </Text>
              </View>
            </View>
          </BlurView>
          <View style={[styles.cardBorder, {borderColor: theme.dividerColor}]} />
        </View>
        {card.frontArt && (
          <View style={[styles.cardImageContainer, { width: imageWidth }]}>
            <Image
              source={{ uri: card.type.toLowerCase() === 'leader' ? card.backArt : card.frontArt }}
              style={[styles.cardImage, {
                width: imageWidth * 1.43,
                height: 80 * 1.43,
                left: -imageWidth * 0.215,
                top: -17.2
              }]}
              contentFit="cover"
              contentPosition={contentPosition}
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
    marginLeft: 0,
    marginVertical: 1,
    minHeight: 80,
  },
  cardContainer: {
    borderRadius: 0,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
    opacity: 0.8,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 0,
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
    paddingVertical: 0,
    borderRadius: 3,
    marginBottom: 0,
    lineHeight: 18,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    marginBottom: 4,
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
    borderRadius: 0,
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