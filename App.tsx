import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
import { initBackgroundScheduler } from './webScraper/utility/backgroundScheduler';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Initialize the background scheduler once when app starts
    initBackgroundScheduler()
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
  container: { flex: 1, paddingBottom: 10 },
});

export default App;
