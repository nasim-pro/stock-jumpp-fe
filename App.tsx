import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
import { headlessTask, initBackgroundScheduler } from './webScraper/utility/backgroundScheduler';
import BackgroundFetch from 'react-native-background-fetch';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Initialize the background scheduler once when app starts
    initBackgroundScheduler()
    // Register the headless task (so it runs when app is killed)
    BackgroundFetch.registerHeadlessTask(headlessTask);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
