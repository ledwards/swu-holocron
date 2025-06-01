import React, {useState, useEffect} from 'react';
import {View, useColorScheme, Appearance, StatusBar, ColorSchemeName, Text, ActivityIndicator} from 'react-native';
import {BlurView} from 'expo-blur';
import {Stack} from 'expo-router';
import {useFonts} from 'expo-font';
import {Image} from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
  const [loadingMessage, setLoadingMessage] = useState<string>('');
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
      const connected = await isConnectedToInternet();
      setInternetConnection(connected);

      const dataExists = await cardDefinitionsExist();

      // Force download to get fresh data every time for now
      if (connected) {
        const downloadSuccess = await downloadCardDefinitions();
        if (!downloadSuccess) {
          return;
        }
      } else if (!dataExists && !connected) {
        return;
      }

      const cards = await loadCardDefinitions();
      setAllCards(cards);
      setCardsLoaded(true);
      
      // Hide splash screen when cards are loaded
      await SplashScreen.hideAsync();
    } catch (error) {
      // Silent error handling
      await SplashScreen.hideAsync();
    }
  };

  if (!loaded || !cardsLoaded) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#000000'
      }}>
        <Image
          source={require('../assets/images/icon.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain'
          }}
        />
        <StatusBar barStyle="light-content" />
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