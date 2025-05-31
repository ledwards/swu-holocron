import {useState, useContext} from 'react';
import {Animated, Easing, Dimensions, Keyboard, Text, View, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import {BlurView} from 'expo-blur';

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

  const [state, setState] = useState<CardListItemState>({
    expanded: false,
    showingBack: false,
    screenWidth: windowWidth,
    heightAnim: new Animated.Value(startingHeight),
    widthAnim: new Animated.Value(windowWidth * fillPercent),
    containerHeightAnim: new Animated.Value(startingHeight / 2),
    labelOpacityAnim: new Animated.Value(1.0),
    minHeight: startingHeight,
    maxHeight: windowWidth * aspectRatio,
    minWidth: windowWidth * fillPercent,
    maxWidth: windowWidth,
    posY: 0,
  });

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
        const isVehicle = props.card.traits.some(trait => trait.toLowerCase().includes('vehicle'));
        return { 
          top: isVehicle ? '27%' : '17%', 
          left: '15%' 
        };
      case 'upgrade':
        return { top: '15%', left: '15%' };
      case 'event':
        return { top: '70%', left: '15%' };
      case 'leader':
        return { top: '15%', left: '15%' };
      case 'base':
        return { top: '20%', left: '15%' };
      default:
        return { top: '15%', left: '15%' };
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
    const needsToCollapse = state.expanded;

    props.scrollToIndex(props.index);

    const t = 300;
    const easing = Easing.elastic(0);

    if (needsToExpand || needsToCollapse) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(state.heightAnim, {
            toValue: state.expanded ? state.minHeight : state.maxHeight,
            duration: t,
            useNativeDriver: false,
            easing: easing,
          }),
          Animated.timing(state.widthAnim, {
            toValue: state.expanded ? state.minWidth : state.maxWidth,
            duration: t,
            useNativeDriver: false,
            easing: easing,
          }),
          Animated.timing(state.containerHeightAnim, {
            toValue: state.expanded ? state.minHeight / 2 : state.maxHeight,
            duration: t,
            useNativeDriver: false,
            easing: easing,
          }),
          Animated.timing(state.labelOpacityAnim, {
            toValue: state.expanded ? 1.0 : 0.0,
            duration: t,
            useNativeDriver: false,
            easing: easing,
          }),
        ]),
      ])
        .start(() => props.scrollToIndex(props.index));
    }

    setState({
      ...state,
      expanded: !needsToCollapse,
    });

    if (props.onPress) {
      props.onPress(props.card);
    }
  };

  const aspectBackgroundColor = getAspectBackgroundColor(props.card.aspects);
  const textColor = aspectBackgroundColor === '#D8D8D8' ? '#000000' : '#FFFFFF';
  const contentPosition = getContentPosition(props.card.type);

  return (
    <Animated.View
      style={{
        height: state.containerHeightAnim,
        marginVertical: 0,
        overflow: 'hidden',
      }}>
      <TouchableOpacity
        testID={`card-item-${props.index}`}
        onPress={() => toggleExpanded()}
        activeOpacity={0.8}
        style={{
          backgroundColor: state.expanded ? '#000000' : aspectBackgroundColor,
          opacity: 0.8,
          flex: 1,
          position: 'relative',
        }}>
        <BlurView intensity={15} tint={theme.name === 'dark' ? 'dark' : 'light'} style={{
          flex: 1,
          overflow: 'hidden',
        }}>
          <View style={{
            paddingLeft: 12,
            paddingRight: 0,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            height: startingHeight * 2,
          }}>
            <Animated.View style={{
              flex: 1,
              paddingRight: 8,
              paddingTop: 6,
              paddingBottom: 8,
              justifyContent: 'center',
              opacity: state.labelOpacityAnim,
            }}>
              <Text 
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  paddingHorizontal: 6,
                  paddingVertical: 0,
                  borderRadius: 3,
                  marginBottom: 4,
                  lineHeight: 18,
                  color: textColor,
                }} 
                numberOfLines={1}
              >
                {props.card.title}
              </Text>
              <Text 
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  fontStyle: 'italic',
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                  borderRadius: 3,
                  marginBottom: 4,
                  color: textColor,
                }}
                numberOfLines={1}
              >
                {props.card.subtitle || ' '}
              </Text>
              <Text 
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                  borderRadius: 3,
                  opacity: 0.9,
                  marginBottom: 4,
                  color: textColor,
                }}
                numberOfLines={1}
              >
                {`${props.card.set} ${props.card.number} • ${props.card.type} • ${getRarityAbbreviation(props.card.rarity)}`}
              </Text>
            </Animated.View>
          </View>
        </BlurView>
        
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            right: state.expanded ? 0 : -60,
            bottom: 0,
            overflow: 'hidden',
            height: state.heightAnim,
            width: state.widthAnim,
          }}>
          <Image
            source={{
              uri: props.card.type.toLowerCase() === 'leader' ? props.card.backArt : props.card.frontArt
            }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 24,
              position: 'relative',
              left: state.expanded ? 0 : -30,
            }}
            contentFit={state.expanded ? "contain" : "cover"}
            contentPosition={state.expanded ? undefined : contentPosition}
            transition={200}
          />
        </Animated.View>
        
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderWidth: 0,
          borderRadius: 0,
          borderColor: 'transparent',
          opacity: 0,
        }} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CardListItem;