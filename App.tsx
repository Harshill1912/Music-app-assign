import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from './src/store/authStore';
import { useFavoritesStore } from './src/store/favoritesStore';
import { usePlayerStore } from './src/store/playerStore';
import { RootNavigator } from './src/navigation/RootNavigator';
import { View, StyleSheet } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

/**
 * App - Main application component
 * Handles auth session restore and global initialization
 */
export default function App() {
  const authStore = useAuthStore();
  const favoritesStore = useFavoritesStore();

  const [appIsReady, setAppIsReady] = React.useState(false);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Restore session
        await authStore.checkSession();

        // Load favorites
        await favoritesStore.loadFavorites();

        // Simulate async work
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setAppIsReady(true);
      }
    };

    initializeApp();
  }, []);

  // Hide splash screen when app is ready
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <RootNavigator
            isLoggedIn={authStore.isLoggedIn}
            isLoading={authStore.isLoading}
          />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
