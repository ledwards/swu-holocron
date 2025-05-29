import React, {useState, useEffect} from 'react';
import {View, useColorScheme, Appearance, StatusBar, ColorSchemeName} from 'react-native';
import {BlurView} from 'expo-blur';
import {Stack} from 'expo-router';
import {useFonts} from 'expo-font';
import 'react-native-reanimated';

import themeDark from '../src/styles/themeDark';
import themeLight from '../src/styles/themeLight';
import layout from '../src/constants/layout';

import ThemeContext from '../src/contexts/ThemeContext';
import { Theme } from '../src/types/interfaces';

export default function RootLayout() {
  const initialTheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [theme, setTheme] = useState<Theme>(
    initialTheme === 'light' ? themeLight as Theme : themeDark as Theme,
  );

  useEffect(() => {
    setTheme(initialTheme === 'light' ? themeLight as Theme : themeDark as Theme);

    Appearance.addChangeListener(({colorScheme}: {colorScheme: ColorSchemeName}) => {
      setTheme(colorScheme === 'light' ? themeLight as Theme : themeDark as Theme);
    });
  }, []);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
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
  );
}