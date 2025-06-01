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
  const startingHeight = (windowWidth * aspectRatio * fillPercent) / 2.5 - 5;

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
    containerHeightAnim: new Animated.Value(startingHeight / 2 - 5),
    labelOpacityAnim: new Animated.Value(1.0),
    minHeight: startingHeight,
    maxHeight: maxHeight,
    minWidth: windowWidth * fillPercent,
    maxWidth: maxWidth,
    posY: 0,
  });

  // Track the current expanded state for immediate contentPosition updates
  const [currentlyExpanded, setCurrentlyExpanded] = useState(false);
  // Track when background should be black (delayed for expansion)
  const [blackBackground, setBlackBackground] = useState(false);


  // Use context to get theme if not provided as prop
  const theme = props.theme || useContext(ThemeContext) || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)'
  };

  const getAspectTextColor = (aspects: string[]): string => {
    if (aspects.length === 0) return '#333333'; // Neutral - black text
    
    const aspectsLower = aspects.map(a => a.toLowerCase());
    const hasCunning = aspectsLower.includes('cunning');
    const hasVillainy = aspectsLower.includes('villainy');
    
    // Villainy + cunning should have white text
    if (hasCunning && hasVillainy) {
      return '#FFFFFF'; // White text for villainy + cunning
    }
    
    // Solo heroism should have black text
    if (aspects.length === 1 && aspectsLower.includes('heroism')) {
      return '#333333'; // Black text for solo heroism
    }
    
    // All yellow should have black text, everything else white
    if (hasCunning) {
      return '#333333'; // Black text for cunning (yellow)
    }
    
    return '#FFFFFF'; // White text for all green, red, blue
  };

  const getAspectBackgroundColor = (aspects: string[]): string => {
    if (aspects.length === 0) return '#C5C8CA';
    
    const aspectsLower = aspects.map(a => a.toLowerCase());
    
    // Check for specific combinations
    const hasVigilance = aspectsLower.includes('vigilance');
    const hasCommand = aspectsLower.includes('command');
    const hasAggression = aspectsLower.includes('aggression');
    const hasCunning = aspectsLower.includes('cunning');
    const hasVillainy = aspectsLower.includes('villainy');
    const hasHeroism = aspectsLower.includes('heroism');
    
    // Command combinations
    if (hasCommand && hasVillainy) {
      return '#082816'; // Command + Villainy
    }
    if (hasCommand && hasHeroism) {
      return '#45B040'; // Command + Heroism
    }
    
    // Aggression combinations
    if (hasAggression && hasVillainy) {
      return '#B6001A'; // Aggression + Villainy
    }
    if (hasAggression && hasHeroism) {
      return '#BB5C4F'; // Aggression + Heroism
    }
    
    // Cunning combinations
    if (hasCunning && hasVillainy) {
      return '#5B482E'; // Cunning + Villainy
    }
    if (hasCunning && hasHeroism) {
      return '#E3D292'; // Cunning + Heroism
    }
    
    // Vigilance combinations
    if (hasVigilance && hasVillainy) {
      return '#0B2541'; // Vigilance + Villainy
    }
    if (hasVigilance && hasHeroism) {
      return '#7BC7E6'; // Vigilance + Heroism
    }
    
    const primaryAspect = aspectsLower.find(a => !['villainy', 'heroism'].includes(a)) || aspectsLower[0];
    
    switch (primaryAspect) {
      case 'aggression':
        return '#941117';
      case 'command':
        return '#149742';
      case 'vigilance':
        return '#2285BB';
      case 'cunning':
        return '#EFA827';
      case 'villainy':
        return '#2A2A2A';
      case 'heroism':
        return '#E0E1C3';
      default:
        return '#C5C8CA';
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
          return [{ translateY: '-20%' }]; // Move up 20% for unique units (was 15%, increased by 5%)
        } else {
          return [{ translateY: '-20%' }]; // Move up 20% for non-unique units (was 15%, increased by 5%)
        }
      case 'upgrade':
        return [{ translateY: '-20%' }]; // Move up 20% for upgrades (was 15%, increased by 5%)
      case 'event':
        return [{ translateY: '-65%' }]; // Move up 65% for events (was 60%, increased by 5%)
      case 'base':
        return [{ translateY: '-25%' }]; // Move up 25% for bases (was 20%, increased by 5%)
      default:
        return [{ translateY: '-5%' }]; // Move up 5% for other types (was no transform)
    }
  };

  const getAspectBorderColor = (aspects: string[]): string => {
    const textColor = getAspectTextColor(aspects);
    
    // Use dark grey for white text, light grey for black text
    if (textColor === '#FFFFFF') {
      return '#666666'; // Dark grey border for white text
    } else {
      return '#CCCCCC'; // Light grey border for black text
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
    
    // Handle background color timing
    if (needsToCollapse) {
      // When collapsing, immediately remove black background
      setBlackBackground(false);
    }
    // When expanding, we'll set black background at animation end
    
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
            toValue: needsToCollapse ? state.minHeight / 2 - 5 : state.maxHeight,
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
          
          // Set black background when expansion completes
          if (needsToExpand) {
            setBlackBackground(true);
          }
        });
    }

    if (props.onPress) {
      props.onPress(props.card);
    }
  };

  const aspectBackgroundColor = getAspectBackgroundColor(props.card.aspects);
  const textColor = getAspectTextColor(props.card.aspects);
  const borderColor = getAspectBorderColor(props.card.aspects);
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
              backgroundColor: blackBackground ? '#000000' : aspectBackgroundColor,
              opacity: 0.8,
              borderWidth: 0,
              borderRadius: 6,
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
              zIndex: 10,
            }
          ]}>
            <View 
              style={{
                backgroundColor: aspectBackgroundColor + '80',
                paddingVertical: 2,
                borderRadius: 4,
                alignSelf: 'flex-start',
                marginLeft: -2,
              }}
            >
              <Text 
                style={[
                  styles.cardTitle,
                  {
                    color: textColor,
                  }
                ]} 
                numberOfLines={1}
              >
                <Text style={{ fontWeight: 'bold' }}>{props.card.title}</Text>
                {props.card.subtitle && (
                  <Text style={{ fontWeight: 'normal', fontStyle: 'italic' }}>, {props.card.subtitle}</Text>
                )}
              </Text>
            </View>
            <View style={{ height: 5 }} />
            <Text 
              style={[
                styles.cardMeta,
                {
                  color: textColor,
                  fontSize: 12,
                }
              ]}
              numberOfLines={1}
            >
              {`${props.card.type} • ${props.card.set} ${props.card.number} • ${getRarityAbbreviation(props.card.rarity)}`}
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