import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Track } from '../../types';

interface FeaturedTracksProps {
  tracks: Track[];
  onTrackPress: (track: Track) => void;
  isLoadingFeatured?: boolean;
}

/**
 * FeaturedTracks - horizontal scrollable section of featured tracks
 */
export const FeaturedTracks: React.FC<FeaturedTracksProps> = ({
  tracks,
  onTrackPress,
  isLoadingFeatured = false,
}) => {
  if (isLoadingFeatured) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Featured Tracks</Text>
        <View style={styles.loadingContainer} />
      </View>
    );
  }

  if (tracks.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Featured Tracks</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {tracks.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.card}
            onPress={() => onTrackPress(track)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: track.coverUrl }}
              style={styles.image}
              progressiveRenderingEnabled
            />
            <View style={styles.cardContent}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {track.title}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {track.artist}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    width: Dimensions.get('window').width * 0.4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
  },
  cardContent: {
    padding: 12,
  },
  trackTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },
  trackArtist: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 4,
  },
  loadingContainer: {
    height: 160,
    marginHorizontal: 16,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
  },
});
