import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function IndexScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>
          Star Wars Unlimited Holocron
        </Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          A companion app for the Star Wars Unlimited card game
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});