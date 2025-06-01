import React, {useContext} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import ThemeContext from '../../contexts/ThemeContext';
import {Theme} from '../../types/interfaces';

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
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://swudb.com/decks/' }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.loadingContainer, {backgroundColor: theme.backgroundColor}]}>
            <ActivityIndicator size="large" color={theme.foregroundColor} />
          </View>
        )}
        style={styles.webView}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default DecklistsScreen;