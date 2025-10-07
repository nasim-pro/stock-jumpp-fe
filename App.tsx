import { Alert, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import StockJumpp from './components/StockJumpp';
import { useEffect } from 'react';
import { initBackgroundScheduler } from './webScraper/utility/backgroundScheduler';




function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  // Initialize Node.js immediately when the app process starts
  useEffect(() => {
    initBackgroundScheduler();
  }, []);
  
  return (
    <View style={styles.container}>
      <StockJumpp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
