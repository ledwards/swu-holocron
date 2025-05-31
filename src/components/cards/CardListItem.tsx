import {useState, useContext} from 'react';
import {Animated, Easing, Dimensions, Keyboard, Text, View, TouchableWithoutFeedback} from 'react-native';
import {Image} from 'expo-image';

import styles from '../../styles/CardListItemStyles';
import ThemeContext from '../../contexts/ThemeContext';
import { Theme, ScrollToIndexFunction } from '../../types/interfaces';
import Card from '../../models/Card';

export interface CardListItemProps {
  card: Card;
  index: number;
  scrollToIndex: ScrollToIndexFunction;
  onPress?: (card: Card) => void;
  theme?: Theme;
}

const CardListItem = (props: CardListItemProps) => {
  const windowWidth = Dimensions.get('window').width;
  const fillPercent = 0.55;
  const aspectRatio = 1.4;

  const isHorizontalCard = (cardType: string): boolean => {
    const type = cardType.toLowerCase();
    return type === 'base' || type === 'leader';
  };

  const horizontal = isHorizontalCard(props.card.type);
  const startingHeight = (windowWidth * aspectRatio * fillPercent) / 2.5;

  interface CardListItemState {
    expanded: boolean;
    showingBack: boolean;
    screenWidth: number;
    heightAnim: Animated.Value;
    widthAnim: Animated.Value;
    containerHeightAnim: Animated.Value;
    labelOpacityAnim: Animated.Value;
    minHeight: number;
    maxHeight: number;
    minWidth: number;
    maxWidth: number;
    posY: number;
  }

  const maxHeight = horizontal ? windowWidth / aspectRatio : windowWidth * aspectRatio;
  const maxWidth = windowWidth;

  const [state, setState] = useState<CardListItemState>({
    expanded: false,
    showingBack: false,
    screenWidth: windowWidth,
    heightAnim: new Animated.Value(startingHeight),
    widthAnim: new Animated.Value(windowWidth * fillPercent),
    containerHeightAnim: new Animated.Value(startingHeight / 2),
    labelOpacityAnim: new Animated.Value(1.0),
    minHeight: startingHeight,
    maxHeight: maxHeight,
    minWidth: windowWidth * fillPercent,
    maxWidth: maxWidth,
    posY: 0,
  });

  // Track the current expanded state for immediate contentPosition updates
  const [currentlyExpanded, setCurrentlyExpanded] = useState(false);


  // Use context to get theme if not provided as prop
  const theme = props.theme || useContext(ThemeContext) || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)'
  };

  const getAspectBackgroundColor = (aspects: string[]): string => {
    if (aspects.length === 0) return '#808080';
    
    const aspectsLower = aspects.map(a => a.toLowerCase());
    const primaryAspect = aspectsLower.find(a => !['villainy', 'heroism'].includes(a)) || aspectsLower[0];
    
    switch (primaryAspect) {
      case 'aggression':
        return '#D25A56';
      case 'command':
        return '#2B4C36';
      case 'vigilance':
        return '#2C3E5C';
      case 'cunning':
        return '#E6C547';
      case 'villainy':
        return '#1A1A1A';
      case 'heroism':
        return '#D8D8D8';
      default:
        return '#4A4A4A';
    }
  };

  const getContentPosition = (cardType: string) => {
    const type = cardType.toLowerCase();
    
    switch (type) {
      case 'unit':
        return { 
          top: '27%', 
          left: '15%' 
        };
      case 'upgrade':
        return { top: '30%', left: '15%' };
      case 'event':
        return { top: '95%', left: '15%' };
      case 'leader':
        return { top: '35%', left: '15%' };
      case 'base':
        return { top: '75%', left: '15%' };
      default:
        return { top: '30%', left: '15%' };
    }
  };

  const getImageTransform = (cardType: string) => {
    if (currentlyExpanded) return []; // No transform when expanded
    
    const type = cardType.toLowerCase();
    
    switch (type) {
      case 'unit':
        const isUnique = props.card.unique;
        
        if (isUnique) {
          return [{ translateY: '-15%' }]; // Move up 15% for unique units
        } else {
          return [{ translateY: '-15%' }]; // Move up 15% for non-unique units
        }
      case 'upgrade':
        return [{ translateY: '-15%' }]; // Move up 15% for upgrades (same as non-unique units)
      case 'event':
        return [{ translateY: '-60%' }]; // Move up 60% for events
      case 'base':
        return [{ translateY: '-20%' }]; // Move up 20% for bases
      default:
        return []; // No transform for other types
    }
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

  const toggleExpanded = (): void => {
    Keyboard.dismiss();
    const needsToExpand = !state.expanded;
    const needsToFlip = false; // SWU cards don't flip like SWCCG
    const needsToCollapse = state.expanded;
    const newExpandedState = !needsToCollapse;

    // Instantly change expanded state to remove crop
    setCurrentlyExpanded(newExpandedState);
    setState({
      ...state,
      showingBack: needsToFlip,
      expanded: newExpandedState,
    });

    const t = 300;
    const easing = Easing.elastic(0);

    if (needsToExpand || needsToCollapse) {
      Animated.sequence([
        Animated.parallel([

          Animated.timing(state.widthAnim, {
            toValue: needsToCollapse ? state.minWidth : state.maxWidth,
            duration: t,
            useNativeDriver: false,
            easing: easing,
          }),
          Animated.timing(state.containerHeightAnim, {
            toValue: needsToCollapse ? state.minHeight / 2 : state.maxHeight,
            duration: t,
            useNativeDriver: false,
            easing: easing,
          }),
          Animated.timing(state.labelOpacityAnim, {
            toValue: needsToCollapse ? 1.0 : 0.0,
            duration: t,
            useNativeDriver: true,
            easing: easing,
          }),
        ]),
      ])
        .start(() => {
          // Scroll after animation completes to avoid jitters
          props.scrollToIndex(props.index);
        });
    }

    if (props.onPress) {
      props.onPress(props.card);
    }
  };

  const aspectBackgroundColor = getAspectBackgroundColor(props.card.aspects);
  const textColor = aspectBackgroundColor === '#D8D8D8' ? '#000000' : '#FFFFFF';
  const contentPosition = getContentPosition(props.card.type);

  return (
    <Animated.View
      style={[
        styles.outerContainer,
        {
          height: state.containerHeightAnim,
        }
      ]}>
      <TouchableWithoutFeedback
        testID={`card-item-${props.index}`}
        onPress={() => toggleExpanded()}>
        <View
          style={[
            styles.cardListItemContainer,
            {
              backgroundColor: state.expanded ? '#000000' : aspectBackgroundColor,
              opacity: 0.8,
            }
          ]}>
        <View style={[
          styles.cardContent,
          {
            height: startingHeight * 2,
          }
        ]}>
          <Animated.View style={[
            styles.cardInfo,
            {
              opacity: state.labelOpacityAnim,
            }
          ]}>
            <Text 
              style={[
                styles.cardTitle,
                {
                  color: textColor,
                }
              ]} 
              numberOfLines={1}
            >
              {props.card.title}
            </Text>
            <Text 
              style={[
                styles.cardSubtitle,
                {
                  color: textColor,
                }
              ]}
              numberOfLines={1}
            >
              {props.card.subtitle || ' '}
            </Text>
            <Text 
              style={[
                styles.cardMeta,
                {
                  color: textColor,
                }
              ]}
              numberOfLines={1}
            >
              {`${props.card.set} ${props.card.number} • ${props.card.type} • ${getRarityAbbreviation(props.card.rarity)}`}
            </Text>
          </Animated.View>
        </View>
        
        <Animated.View
          style={[
            styles.cardListItem,
            {
              width: state.widthAnim,
              aspectRatio: horizontal ? 1.4 : 1/1.4,
            },
            !state.expanded
              ? styles.cardListItemExpanded
              : styles.cardListItemCollapsed,
          ]}>
          <Image
            source={{
              uri: props.card.type.toLowerCase() === 'leader' 
                ? (currentlyExpanded ? props.card.frontArt : props.card.backArt)
                : props.card.frontArt
            }}
            style={[
              styles.cardListItemImage,
              !state.expanded
                ? styles.cardListItemImageExpanded
                : styles.cardListItemImageCollapsed,
              { 
                borderRadius: 20,
                transform: getImageTransform(props.card.type)
              },
            ]}
            contentFit={currentlyExpanded && horizontal ? "contain" : "cover"}
            contentPosition={currentlyExpanded ? undefined : contentPosition}
          />
        </Animated.View>
        
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default CardListItem;