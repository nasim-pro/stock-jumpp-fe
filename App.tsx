import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
// import { initBackgroundScheduler } from './webScraper/utility/backgroundScheduler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleFiveAMTask } from './webScraper/utility/AlarmScheduler';
import { initBackgroundScheduler } from './webScraper/utility/backgroundScheduler';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Initialize the background scheduler once when app starts
    initBackgroundScheduler()
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     await scheduleFiveAMTask(); // no AsyncStorage handling here
  //   })();
  // }, []);


  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={'#4f96c9'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 15, backgroundColor: "#4f96c9b0" },
});

export default App;
