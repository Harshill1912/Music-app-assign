import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePlayerStore } from '../store/playerStore';
import { View, StyleSheet } from 'react-native';

// Screens
import LoginScreen from '../screens/login/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import PlayerScreen from '../screens/player/PlayerScreen';
import ArtistScreen from '../screens/artist/ArtistScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import { MiniPlayer } from '../components/MiniPlayer';
import { MOCK_TRACKS } from '../api/mockData';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Player: { trackId: string };
  Artist: { artistId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  FavoritesTab: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * HomeStack - Stack navigator for home screen and related screens
 */
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f8f9fa' },
        }}
      />
      <Stack.Screen
        name="Artist"
        component={ArtistScreen}
        options={{
          headerTitle: 'Artist',
          headerBackTitle: '',
          headerTintColor: '#2c3e50',
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#ecf0f1',
          },
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * FavoritesStack - Stack navigator for favorites screen
 */
const FavoritesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f8f9fa' },
        }}
      />
      <Stack.Screen
        name="Artist"
        component={ArtistScreen}
        options={{
          headerTitle: 'Artist',
          headerBackTitle: '',
          headerTintColor: '#2c3e50',
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#ecf0f1',
          },
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * MainTabNavigator - Bottom tab navigation
 */
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ecf0f1',
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * MiniPlayerWrapper - Wraps the main navigation with mini player overlay
 */
const MiniPlayerWrapper = ({ navigation }: any) => {
  const playerStore = usePlayerStore();
  const currentTrack = MOCK_TRACKS.find((t) => t.id === playerStore.currentTrackId) || null;

  return (
    <View style={styles.wrapper}>
      <MainTabNavigator />
      {currentTrack && (
        <MiniPlayer
          track={currentTrack}
          isPlaying={playerStore.isPlaying}
          onPlayPausePress={() => playerStore.togglePlayPause()}
          onPlayerPress={() => {
            if (playerStore.currentTrackId) {
              navigation.navigate('Player', { trackId: playerStore.currentTrackId });
            }
          }}
        />
      )}
    </View>
  );
};

/**
 * RootNavigator - Main app navigation with auth flow
 */
interface RootNavigatorProps {
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({
  isLoggedIn,
  isLoading,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f8f9fa' },
        }}
      >
        {!isLoggedIn ? (
          <Stack.Screen
            name="Auth"
            component={LoginScreen}
            options={{
              animationEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="Main"
            component={MiniPlayerWrapper}
            options={{
              animationEnabled: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default RootNavigator;
