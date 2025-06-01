import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BlurView} from 'expo-blur';

import CardsScreen from '../../src/components/cards/CardsScreen';
import DecklistsScreen from '../../src/components/decklists/DecklistsScreen';

import SearchFooter from '../../src/components/SearchFooter';
import SearchContext from '../../src/contexts/SearchContext';

import styles from '../../src/styles/TabNavigation';
import layout from '../../src/constants/layout';
import ThemeContext from '../../src/contexts/ThemeContext';
import {Theme} from '../../src/types/interfaces';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const iconSize = 24;
  const [searchQuery, setSearchQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);
  const themeContext = useContext(ThemeContext);
  const theme: Theme = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)',
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, resultCount, setResultCount }}>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
        initialRouteName="Cards"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBarStyle,
            bottom: layout.nativeFooterHeight(),
            height: layout.tabBarHeight(),
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            zIndex: 1001,
          },
          tabBarItemStyle: styles.tabBarItemStyle,
        }}>
      <Tab.Screen
        name="Cards"
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: () => (
            <Icon
              name={'search-outline'}
              type="ionicon"
              color={theme?.foregroundColor}
              size={iconSize}
            />
          ),
        }}>
        {() => (
          <View
            style={{
              flex: 1,
              backgroundColor: theme?.backgroundColor,
            }}>
            <CardsScreen />
          </View>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Decklists"
        options={{
          tabBarLabel: 'Decklists',
          tabBarIcon: () => (
            <Icon
              name={'file-tray-full-outline'}
              type="ionicon"
              color={theme?.foregroundColor}
              size={iconSize}
            />
          ),
        }}>
        {() => (
          <View
            style={{
              flex: 1,
              backgroundColor: theme?.backgroundColor,
            }}>
            <DecklistsScreen />
          </View>
        )}
      </Tab.Screen>

      </Tab.Navigator>
      
      {/* Blur layer for tab bar - visible on all screens */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: layout.tabBarHeight() + layout.nativeFooterHeight(),
        pointerEvents: 'none',
      }}>
        <BlurView
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: layout.tabBarHeight() + layout.nativeFooterHeight(),
          }}
          intensity={50}
          tint={theme.name === 'dark' ? 'dark' : 'light'}
        />
      </View>
      
      {/* Top blur layer for header - visible on all screens */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: layout.nativeHeaderHeight(),
        pointerEvents: 'none',
      }}>
        <BlurView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: layout.nativeHeaderHeight(),
          }}
          intensity={50}
          tint={theme.name === 'dark' ? 'dark' : 'light'}
        />
      </View>
      
      <SearchFooter 
        onSearchChange={setSearchQuery}
        onToggleSearchMode={() => {
          // TODO: Handle search mode toggle
        }}
        resultCount={resultCount}
        searchTerm={searchQuery}
      />
      </View>
    </SearchContext.Provider>
  );
}