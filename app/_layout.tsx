import React, {useState, useEffect} from 'react';
import {View, useColorScheme, Appearance, StatusBar, ColorSchemeName, Text, ActivityIndicator} from 'react-native';
import {BlurView} from 'expo-blur';
import {Stack} from 'expo-router';
import {useFonts} from 'expo-font';
import 'react-native-reanimated';

import Card from '../src/models/Card';
import downloadCardDefinitions from '../src/lib/DownloadCardDefinitions';
import loadCardDefinitions, { cardDefinitionsExist } from '../src/lib/LoadCardDefinitions';
import { isConnectedToInternet } from '../src/lib/NetworkUtils';

import themeDark from '../src/styles/themeDark';
import themeLight from '../src/styles/themeLight';
import layout from '../src/constants/layout';

import ThemeContext from '../src/contexts/ThemeContext';
import AllCardsContext from '../src/contexts/AllCardsContext';
import { Theme } from '../src/types/interfaces';

export default function RootLayout() {
  const initialTheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [theme, setTheme] = useState<Theme>(
    initialTheme === 'light' ? themeLight as Theme : themeDark as Theme,
  );

  const [allCards, setAllCards] = useState<Card[]>([]);
  const [cardsLoaded, setCardsLoaded] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');
  const [internetConnection, setInternetConnection] = useState<boolean>(false);

  useEffect(() => {
    setTheme(initialTheme === 'light' ? themeLight as Theme : themeDark as Theme);

    Appearance.addChangeListener(({colorScheme}: {colorScheme: ColorSchemeName}) => {
      setTheme(colorScheme === 'light' ? themeLight as Theme : themeDark as Theme);
    });
  }, []);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoadingMessage('Checking internet connection...');
      const connected = await isConnectedToInternet();
      setInternetConnection(connected);

      setLoadingMessage('Checking for existing card data...');
      const dataExists = await cardDefinitionsExist();

      // Force download to get fresh data every time for now
      if (connected) {
        setLoadingMessage('Downloading fresh card data from GitHub...');
        const downloadSuccess = await downloadCardDefinitions();
        if (!downloadSuccess) {
          setLoadingMessage('Failed to download card data. Please check your internet connection.');
          return;
        }
      } else if (!dataExists && !connected) {
        setLoadingMessage('No internet connection and no cached data available.');
        return;
      }

      setLoadingMessage('Loading cards...');
      const cards = await loadCardDefinitions();
      console.log(`Loaded ${cards.length} cards into app`);
      setAllCards(cards);
      setCardsLoaded(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      setLoadingMessage('Error loading card data. Please restart the app.');
    }
  };

  if (!loaded || !cardsLoaded) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.backgroundColor 
      }}>
        <ActivityIndicator size="large" color={theme.foregroundColor} />
        <Text style={{ 
          color: theme.foregroundColor, 
          marginTop: 20,
          fontSize: 16,
          textAlign: 'center',
          paddingHorizontal: 40
        }}>
          {loadingMessage}
        </Text>
        <StatusBar barStyle={theme.statusBarStyle as 'light-content' | 'dark-content' | 'default'} />
      </View>
    );
  }

  return (
    <AllCardsContext.Provider value={allCards}>
      <ThemeContext.Provider value={theme}>
        <View style={{width: '100%', height: '100%'}}>
          <StatusBar barStyle={theme.statusBarStyle as 'light-content' | 'dark-content' | 'default'} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: layout.nativeHeaderHeight(),
            }}
            intensity={50}
            tint={theme.name === 'dark' ? 'dark' : 'light'}
          />
        </View>
      </ThemeContext.Provider>
    </AllCardsContext.Provider>
  );
}