import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { TrackCard } from '../../components/TrackCard';
import { LoadingIndicator, ErrorMessage, EmptyState } from '../../components/index';
import { usePlayerStore } from '../../store/playerStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAudioPlayback } from '../../hooks';
import { formatFollowers } from '../../utils/formatters';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { MOCK_ARTISTS, MOCK_TRACKS } from '../../api/mockData';
import { Artist } from '../../types';

type Props = StackScreenProps<RootStackParamList, 'Artist'>;

/**
 * ArtistScreen - Artist profile with their track listing
 */
const ArtistScreen: React.FC<Props> = ({ route }) => {
  const { artistId } = route.params;
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const playerStore = usePlayerStore();
  const favoritesStore = useFavoritesStore();
  const { playTrack } = useAudioPlayback();

  // Load artist data
  useEffect(() => {
    const loadArtist = async () => {
      try {
        setIsLoading(true);
        const foundArtist = MOCK_ARTISTS.find((a) => a.id === artistId);
        setArtist(foundArtist || null);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtist();
  }, [artistId]);

  const handlePlayTrack = useCallback(
    (track) => {
      if (artist) {
        playerStore.setQueue(artist.tracks);
        playTrack(track);
      }
    },
    [artist, playerStore, playTrack]
  );

  const handleFavoriteToggle = useCallback(
    (trackId: string) => {
      favoritesStore.toggleFavorite(trackId);
    },
    [favoritesStore]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator message="Loading artist..." />
      </SafeAreaView>
    );
  }

  if (!artist) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage message="Artist not found" />
      </SafeAreaView>
    );
  }

  const artistTracks = MOCK_TRACKS.filter((t) => t.artistId === artistId);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={artistTracks}
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
            {/* Artist Photo */}
            <Image
              source={{ uri: artist.photoUrl }}
              style={styles.photo}
            />

            {/* Artist Info */}
            <Text style={styles.name}>{artist.name}</Text>
            <Text style={styles.followers}>
              {formatFollowers(artist.followers)} followers
            </Text>

            {/* Bio */}
            <Text style={styles.bio}>{artist.bio}</Text>

            {/* Tracks Title */}
            <Text style={styles.tracksTitle}>
              Tracks ({artistTracks.length})
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Tracks"
            message="This artist has no tracks available"
            icon="music"
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
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
  },
  followers: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 8,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  tracksTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: 24,
    marginBottom: 12,
    width: '100%',
  },
});

export default ArtistScreen;
