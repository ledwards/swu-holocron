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
    leaderState: 'collapsed' | 'front' | 'back';
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
    leaderState: 'collapsed',
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

  const mixColorWithTheme = (color: string, isDarkTheme: boolean): string => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Mix 30% with black (dark theme) or 50% with white (light theme)
    if (isDarkTheme) {
      const newR = Math.round(r * 0.7);
      const newG = Math.round(g * 0.7);
      const newB = Math.round(b * 0.7);
      return '#' + ((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0');
    } else {
      const newR = Math.round((r + 255) / 2);
      const newG = Math.round((g + 255) / 2);
      const newB = Math.round((b + 255) / 2);
      return '#' + ((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0');
    }


  };

  const getAspectTextColor = (aspects: string[]): string => {
    if (aspects.length === 0) return '#000000'; // Neutral - always black text
    
    const aspectsLower = aspects.map(a => a.toLowerCase());
    
    // Check for pure villainy or heroism
    if (aspects.length === 1) {
      if (aspectsLower[0] === 'villainy') {
        return '#FFFFFF'; // Villainy - always white text
      }
      if (aspectsLower[0] === 'heroism') {
        return '#333333'; // Heroism - always black text
      }
    }
    
    // For all other combinations, use theme-based text
    const isDarkTheme = theme.name === 'dark';
    return isDarkTheme ? '#FFFFFF' : '#333333';
  };

  const getAspectBackgroundColor = (aspects: string[]): string => {
    const isDarkTheme = theme.name === 'dark';
    let baseColor = '#C5C8CA';

    if (aspects.length === 0) {
      return '#808080'; // Always grey for neutral
    }

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
      baseColor = '#1A5D2E'; // Command + Villainy
    } else if (hasCommand && hasHeroism) {
      baseColor = '#45B040'; // Command + Heroism
    }
    // Aggression combinations
    else if (hasAggression && hasVillainy) {
      baseColor = '#B6001A'; // Aggression + Villainy
    } else if (hasAggression && hasHeroism) {
      baseColor = '#D67A6B'; // Aggression + Heroism
    }
    // Cunning combinations
    else if (hasCunning && hasVillainy) {
      baseColor = '#A69018'; // Cunning + Villainy
    } else if (hasCunning && hasHeroism) {
      baseColor = '#FFF200'; // Cunning + Heroism
    }
    // Vigilance combinations
    else if (hasVigilance && hasVillainy) {
      baseColor = '#1E4A72'; // Vigilance + Villainy
    } else if (hasVigilance && hasHeroism) {
      baseColor = '#7BC7E6'; // Vigilance + Heroism
    } else {
      const primaryAspect = aspectsLower.find(a => !['villainy', 'heroism'].includes(a)) || aspectsLower[0];

      switch (primaryAspect) {
        case 'aggression':
          baseColor = '#941117';
          break;
        case 'command':
          baseColor = '#149742';
          break;
        case 'vigilance':
          baseColor = '#2285BB';
          break;
        case 'cunning':
          baseColor = '#FFB000';
          break;
        case 'villainy':
          return '#2A2A2A'; // Always dark grey
        case 'heroism':
          return '#E0E1C3'; // Always near white
        default:
          baseColor = '#808080';
      }
    }

    return mixColorWithTheme(baseColor, isDarkTheme);
  };

  const getContentPosition = (cardType: string) => {
    // Special handling for Chancellor Palpatine - both sides use same position
    const isChancellorPalpatine = props.card.title === "Chancellor Palpatine" && props.card.subtitle === 'Playing Both Sides' || false;
    if (isChancellorPalpatine) {
      return { top: '35%', left: '-60%' };
    }

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
        return { top: '35%', left: '-60%' };
      case 'base':
        return { top: '105%', left: '15%' };
      default:
        return { top: '30%', left: '15%' };
    }
  };

  const getImageTransform = (cardType: string) => {
    if (currentlyExpanded) return []; // No transform when expanded

    // Special handling for Chancellor Palpatine - both sides use same transform
    const isChancellorPalpatine = props.card.title === "Chancellor Palpatine" && props.card.subtitle === 'Playing Both Sides' || false;
    if (isChancellorPalpatine) {
      return [{ translateX: 120 }, { translateY: 15 }, { scale: 2 }];
    }

    const type = cardType.toLowerCase();

    switch (type) {
      case 'unit':
        const isUnique = props.card.unique;

        if (isUnique) {
          return [{ translateY: -60 }]; // Move up for unique units
        } else {
          return [{ translateY: -60 }]; // Move up for non-unique units
        }
      case 'upgrade':
        return [{ translateY: -60 }]; // Move up for upgrades
      case 'event':
        return [{ translateY: -200 }]; // Move up for events
      case 'leader':
        return [{ translateX: 120 }, { translateY: 15 }, { scale: 2 }]; // Move right, down, and zoom 2x to show leftmost leader artwork
      case 'base':
        return [{ translateY: -33 }]; // Move up slightly for bases
      default:
        return [{ translateY: -15 }]; // Move up for other types
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

  const getDisplayType = (card: Card): string => {
    if (card.type.toLowerCase() === 'unit') {
      if (card.arenas.some(arena => arena.toLowerCase() === 'space')) {
        return 'Space Unit';
      } else if (card.arenas.some(arena => arena.toLowerCase() === 'ground')) {
        return 'Ground Unit';
      }
    }
    return card.type;
  };

  const toggleExpanded = (): void => {
    Keyboard.dismiss();

    const isLeader = props.card.type.toLowerCase() === 'leader';

    if (isLeader) {
      handleLeaderToggle();
    } else {
      handleNormalCardToggle();
    }

    if (props.onPress) {
      props.onPress(props.card);
    }
  };

  const handleLeaderToggle = (): void => {
    const { leaderState } = state;
    let newLeaderState: 'collapsed' | 'front' | 'back';
    let needsToExpand = false;
    let needsToCollapse = false;
    let needsToFlip = false;
    let newExpandedState = false;
    let newShowingBack = false;

    switch (leaderState) {
      case 'collapsed':
        // collapsed → front expanded
        newLeaderState = 'front';
        needsToExpand = true;
        newExpandedState = true;
        newShowingBack = false;
        break;
      case 'front':
        // front expanded → back expanded
        newLeaderState = 'back';
        needsToFlip = true;
        newExpandedState = true;
        newShowingBack = true;
        break;
      case 'back':
        // back expanded → collapsed
        newLeaderState = 'collapsed';
        needsToCollapse = true;
        newExpandedState = false;
        newShowingBack = false;
        break;
    }

    // Instantly change expanded state to remove crop
    setCurrentlyExpanded(newExpandedState);

    // Handle background color timing
    if (needsToCollapse) {
      setBlackBackground(false);
    }
    if (needsToExpand) {
      setBlackBackground(true);
    }

    setState({
      ...state,
      leaderState: newLeaderState,
      showingBack: newShowingBack,
      expanded: newExpandedState,
    });

    const t = 300;
    const easing = Easing.elastic(0);

    // Determine if we need to resize (expand/collapse) or just flip
    const needsResize = needsToExpand || needsToCollapse;

    if (needsResize) {
      // Animate size change
      Animated.sequence([
        Animated.parallel([
          Animated.timing(state.widthAnim, {
            toValue: needsToCollapse ? state.minWidth : state.maxWidth,
            duration: t,
            useNativeDriver: false,
            easing: easing,
          }),
          Animated.timing(state.containerHeightAnim, {
            toValue: needsToCollapse ? state.minHeight / 2 - 5 : (windowWidth / aspectRatio),
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
      ]).start(() => {
        props.scrollToIndex(props.index);
      });
    } else if (needsToFlip) {
      // Flipping from front to back
      const isChancellorPalpatine = props.card.title === "Chancellor Palpatine" && props.card.subtitle === 'Playing Both Sides' || false;

      if (isChancellorPalpatine) {
        // Chancellor Palpatine - both sides are horizontal, no resize needed
        props.scrollToIndex(props.index);
      } else {
        // Normal leaders - animate to vertical card height for unit back
        const backHeight = windowWidth * aspectRatio;
        const backWidth = getLeaderBackWidth();
        Animated.parallel([
          Animated.timing(state.containerHeightAnim, {
            toValue: backHeight,
            duration: t,
            useNativeDriver: false,
            easing: easing,
          }),
          Animated.timing(state.widthAnim, {
            toValue: backWidth,
            duration: t,
            useNativeDriver: false,
            easing: easing,
          }),
        ]).start(() => {
          props.scrollToIndex(props.index);
        });
      }
    }
  };

  const handleNormalCardToggle = (): void => {
    const needsToExpand = !state.expanded;
    const needsToCollapse = state.expanded;
    const newExpandedState = !needsToCollapse;

    // Instantly change expanded state to remove crop
    setCurrentlyExpanded(newExpandedState);

    // Handle background color timing
    if (needsToCollapse) {
      setBlackBackground(false);
    }
    if (needsToExpand) {
      setBlackBackground(true);
    }

    setState({
      ...state,
      showingBack: false,
      expanded: newExpandedState,
    });

    const t = 300;
    const easing = Easing.elastic(0);

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
    ]).start(() => {
      props.scrollToIndex(props.index);
    });
  };

  const getLeaderHeight = (): number => {
    const { leaderState } = state;

    if (leaderState === 'front') {
      // Leader side is always horizontal
      return windowWidth / aspectRatio;
    } else if (leaderState === 'back') {
      // Most leader backs are vertical (units), but some like Chancellor Palpatine are horizontal (bases)
      const backIsHorizontal = props.card.subtitle?.toLowerCase().includes('chancellor') || false;
      if (backIsHorizontal) {
        return windowWidth / aspectRatio;
      } else {
        // Explicitly use full vertical card height - same as maxHeight for vertical cards
        const verticalCardHeight = windowWidth * aspectRatio;
        return verticalCardHeight;
      }
    }

    return windowWidth * aspectRatio; // Default to vertical card height
  };

  const getLeaderBackWidth = (): number => {
    // Use 100% of the list item container width
    return windowWidth;
  };

  // Calculate if current side is horizontal based on what we're showing
  const getCurrentSideHorizontal = (): boolean => {
    if (props.card.type.toLowerCase() === 'leader') {
      if (state.showingBack) {
        // Most leader backs are vertical units, except special cases like Chancellor Palpatine
        const isChancellorPalpatine = props.card.title === "Chancellor Palpatine" && props.card.subtitle === 'Playing Both Sides' || false;
        return isChancellorPalpatine;
      } else {
        // Leader front side is always horizontal
        return true;
      }
    } else {
      // Normal cards use their type
      return isHorizontalCard(props.card.type);
    }
  };

  const currentSideHorizontal = getCurrentSideHorizontal();
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
              borderWidth: 0,
              borderRadius: currentlyExpanded ? 16 : 6,
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
              {`${getDisplayType(props.card)} • ${props.card.set} ${props.card.number} • ${getRarityAbbreviation(props.card.rarity)}`}
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.cardListItem,
            {
              width: state.widthAnim,
              aspectRatio: currentSideHorizontal ? 1.4 : 1/1.4,
            },
            !state.expanded
              ? styles.cardListItemExpanded
              : styles.cardListItemCollapsed,
          ]}>
          <Image
            source={{
              uri: state.showingBack ? props.card.backArt : props.card.frontArt
            }}
            style={[
              styles.cardListItemImage,
              !state.expanded
                ? styles.cardListItemImageExpanded
                : styles.cardListItemImageCollapsed,
              {
                borderRadius: currentlyExpanded ? 32 : 20,
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
