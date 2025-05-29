import React, {useContext} from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import CardsScreen from '../../src/components/cards/CardsScreen';
import DecklistsScreen from '../../src/components/decklists/DecklistsScreen';

import styles from '../../src/styles/TabNavigation';
import layout from '../../src/constants/layout';
import ThemeContext from '../../src/contexts/ThemeContext';
import {Theme} from '../../src/types/interfaces';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const iconSize = 24;
  const themeContext = useContext(ThemeContext);
  const theme: Theme | null = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)',
  };

  return (
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
        },
        tabBarItemStyle: styles.tabBarItemStyle,
      }}>
      <Tab.Screen
        name="Cards"
        children={() => (
          <View
            style={{
              flex: 1,
              backgroundColor: theme?.backgroundColor,
            }}>
            <CardsScreen />
          </View>
        )}
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
        }}
      />
      <Tab.Screen
        name="Decklists"
        children={() => (
          <View
            style={{
              flex: 1,
              backgroundColor: theme?.backgroundColor,
            }}>
            <DecklistsScreen />
          </View>
        )}
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
        }}
      />
    </Tab.Navigator>
  );
}