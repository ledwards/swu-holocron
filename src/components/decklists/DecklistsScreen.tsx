import React, {useContext} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import ThemeContext from '../../contexts/ThemeContext';
import {Theme} from '../../types/interfaces';
import layout from '../../constants/layout';

const DecklistsScreen = () => {
  const themeContext = useContext(ThemeContext);
  const theme: Theme = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)',
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.header, {height: layout.nativeHeaderHeight()}]} />
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: 'https://swu-competitivehub.com' }}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={[styles.loadingContainer, {backgroundColor: theme.backgroundColor}]}>
              <ActivityIndicator size="large" color={theme.foregroundColor} />
            </View>
          )}
          style={styles.webView}
        />
      </View>
      <View style={[styles.footer, {height: layout.footerHeight(layout.tabBarHeight(), undefined)}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    width: '100%',
  },
});

export default DecklistsScreen;