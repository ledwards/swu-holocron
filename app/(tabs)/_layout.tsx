import React, {useContext, useState, useRef} from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BlurView} from 'expo-blur';

import CardsScreen from '../../src/components/cards/CardsScreen';
import RulesScreen from '../../src/components/rules/RulesScreen';
import type { RulesScreenRef } from '../../src/components/rules/RulesScreen';

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
  const [activeTab, setActiveTab] = useState('Cards');
  const [currentSearchResult, setCurrentSearchResult] = useState(0);
  const [onNavigateNext, setOnNavigateNext] = useState<(() => void) | undefined>(undefined);
  const [onNavigatePrev, setOnNavigatePrev] = useState<(() => void) | undefined>(undefined);
  
  // Separate state for PDF search
  const [pdfSearchQuery, setPdfSearchQuery] = useState('');
  const [pdfResultCount, setPdfResultCount] = useState(0);
  const [pdfCurrentResult, setPdfCurrentResult] = useState(0);
  const rulesScreenRef = useRef<any>(null);
  const themeContext = useContext(ThemeContext);
  const theme: Theme = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)',
  };

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      resultCount, 
      setResultCount,
      currentSearchResult,
      setCurrentSearchResult,
      setOnNavigateNext,
      setOnNavigatePrev
    }}>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
        initialRouteName="Cards"
        screenListeners={{
          state: (e) => {
            const route = e.data?.state?.routes[e.data?.state?.index];
            if (route) {
              setActiveTab(route.name);
            }
          },
        }}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBarStyle,
            bottom: layout.nativeFooterHeight(),
            height: layout.tabBarHeight(),
            marginTop: activeTab === 'Cards' ? 0 : 8,
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
        name="RulesTab"
        options={{
          tabBarLabel: 'Rules',
          tabBarIcon: () => (
            <Icon
              name={'book-outline'}
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
            <RulesScreen 
              ref={rulesScreenRef}
              onSearchResultsChange={(results) => {
                setPdfResultCount(results.total);
                setPdfCurrentResult(results.current);
              }}
            />
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
        height: layout.tabBarHeight() + layout.nativeFooterHeight() + (activeTab === 'Cards' ? 0 : 8),
        pointerEvents: 'none',
      }}>
        <BlurView
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: layout.tabBarHeight() + layout.nativeFooterHeight() + (activeTab === 'Cards' ? 0 : 8),
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
      
      {activeTab === 'Cards' && (
        <SearchFooter 
          onSearchChange={setSearchQuery}
          onToggleSearchMode={() => {
            // TODO: Handle search mode toggle
          }}
          resultCount={resultCount}
          searchTerm={searchQuery}
          activeTab={activeTab}
          currentResult={currentSearchResult}
          onNavigateNext={onNavigateNext}
          onNavigatePrev={onNavigatePrev}
        />
      )}
      
      {activeTab === 'RulesTab' && (
        <SearchFooter 
          onSearchChange={(text) => {
            setPdfSearchQuery(text);
            rulesScreenRef.current?.performSearch(text);
          }}
          resultCount={pdfResultCount}
          searchTerm={pdfSearchQuery}
          activeTab={activeTab}
          currentResult={pdfCurrentResult}
          onNavigateNext={() => rulesScreenRef.current?.navigateNext()}
          onNavigatePrev={() => rulesScreenRef.current?.navigatePrev()}
        />
      )}
      </View>
    </SearchContext.Provider>
  );
}