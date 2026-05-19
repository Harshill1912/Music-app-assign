import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { TrackCard } from '../../components/TrackCard';
import { FeaturedTracks } from '../../components/FeaturedTracks';
import { LoadingIndicator, ErrorMessage, EmptyState } from '../../components/index';
import { usePlayerStore } from '../../store/playerStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';
import { useAudioPlayback, useNavigationTracking, useTrackFetch } from '../../hooks';
import { trackAPI } from '../../api';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Track } from '../../types';

type Props = StackScreenProps<RootStackParamList>;

/**
 * HomeScreen - Main track browsing screen
 */
const HomeScreen: React.FC<Props> = () => {
  useNavigationTracking('Home');

  const fetchAllTracks = useCallback(() => trackAPI.getAllTracks(), []);
  const fetchFeaturedTracks = useCallback(() => trackAPI.getFeaturedTracks(), []);
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);

  const { tracks, isLoading, error } = useTrackFetch(fetchAllTracks);
  const {
    tracks: featuredTracks,
    isLoading: isLoadingFeatured,
  } = useTrackFetch(fetchFeaturedTracks);

  const playerStore = usePlayerStore();
  const favoritesStore = useFavoritesStore();
  const authStore = useAuthStore();

  const { playTrack } = useAudioPlayback();

  // Load favorites on mount
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  // Handle track play
  const handlePlayTrack = useCallback(
    (track: Track) => {
      playerStore.setQueue(tracks);
      playTrack(track);
    },
    [playerStore, playTrack, tracks]
  );

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(
    (trackId: string) => {
      favoritesStore.toggleFavorite(trackId);
    },
    [favoritesStore]
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    // Refresh logic would go here
  }, []);

  const renderHeader = () => {
    const user = authStore.user;
    return (
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {user?.email.split('@')[0]}! 👋
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrackCard
              track={item}
              onPress={() => handlePlayTrack(item)}
              onFavoritePress={handleFavoriteToggle}
              isFavorite={favoritesStore.isFavorite(item.id)}
              isPlaying={playerStore.currentTrackId === item.id}
            />
          )}
          ListHeaderComponent={
            <>
              {renderHeader()}
              <FeaturedTracks
                tracks={featuredTracks}
                onTrackPress={handlePlayTrack}
                isLoadingFeatured={isLoadingFeatured}
              />
              <Text style={styles.allTracksTitle}>All Tracks</Text>
            </>
          }
          ListEmptyComponent={
            isLoading ? (
              <LoadingIndicator message="Loading tracks..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <EmptyState
                title="No Tracks Found"
                message="There are no tracks available at the moment"
                icon="music"
              />
            )
          }
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  allTracksTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
});

export default HomeScreen;
