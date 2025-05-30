import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ThemeContext from '../../contexts/ThemeContext';
import {Theme} from '../../types/interfaces';
import layout from '../../constants/layout';

const CardsScreen = () => {
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
          Star Wars Unlimited Cards
        </Text>
        <Text style={[styles.subtitle, {color: theme.foregroundColor}]}>
          Search and browse cards from the Star Wars Unlimited card game
        </Text>
      </View>
      <View style={[styles.footer, {height: layout.footerHeight(layout.tabBarHeight(), undefined) + 40}]} />
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

export default CardsScreen;