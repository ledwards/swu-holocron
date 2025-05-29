import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
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
      <View style={styles.content}>
        <Text style={[styles.title, {color: theme.foregroundColor}]}>
          Star Wars Unlimited Decklists
        </Text>
        <Text style={[styles.subtitle, {color: theme.foregroundColor}]}>
          Browse and manage your Star Wars Unlimited decks
        </Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    width: '100%',
  },
});

export default DecklistsScreen;