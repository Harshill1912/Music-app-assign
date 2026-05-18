import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { TrackCard } from '../../components/TrackCard';
import { EmptyState } from '../../components/index';
import { usePlayerStore } from '../../store/playerStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAudioPlayback, useNavigationTracking } from '../../hooks';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { MOCK_TRACKS } from '../../api/mockData';

type Props = StackScreenProps<RootStackParamList>;

/**
 * FavoritesScreen - Display all favorited tracks
 */
const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  useNavigationTracking('Favorites');

  const playerStore = usePlayerStore();
  const favoritesStore = useFavoritesStore();
  const { playTrack } = useAudioPlayback();

  // Load favorites on mount and focus
  useFocusEffect(
    useCallback(() => {
      favoritesStore.loadFavorites();
    }, [favoritesStore])
  );

  const favoriteTracks = MOCK_TRACKS.filter((track) =>
    favoritesStore.isFavorite(track.id)
  );

  const handlePlayTrack = useCallback(
    (track) => {
      playerStore.setQueue(favoriteTracks);
      playTrack(track);
    },
    [playerStore, playTrack, favoriteTracks]
  );

  const handleFavoriteToggle = useCallback(
    (trackId: string) => {
      favoritesStore.toggleFavorite(trackId);
    },
    [favoritesStore]
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favoriteTracks}
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
          <View style={styles.header}>
            <Text style={styles.title}>Favorite Tracks</Text>
            <Text style={styles.subtitle}>
              {favoriteTracks.length} track{favoriteTracks.length !== 1 ? 's' : ''}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Favorites Yet"
            message="Start adding your favorite tracks by tapping the heart icon"
            icon="heart-outline"
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingBottom: 80,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
});

export default FavoritesScreen;
