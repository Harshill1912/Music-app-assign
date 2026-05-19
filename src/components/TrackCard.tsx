import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Track } from '../types';
import { formatTime } from '../utils/formatters';

interface TrackCardProps {
  track: Track;
  onPress: () => void;
  onFavoritePress: (trackId: string) => void;
  isFavorite: boolean;
  isPlaying: boolean;
}

/**
 * TrackCard component - displays a track with cover art and metadata
 */
export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onPress,
  onFavoritePress,
  isFavorite,
  isPlaying,
}) => {
  const [equalizerAnimation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(equalizerAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(equalizerAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isPlaying, equalizerAnimation]);

  return (
    <TouchableOpacity
      style={[styles.container, isPlaying && styles.containerPlaying]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Cover Art */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: track.coverUrl }}
          style={styles.image}
          progressiveRenderingEnabled
        />
        {isPlaying && (
          <View style={styles.playingOverlay}>
            <MaterialCommunityIcons
              name="equalizer"
              size={24}
              color="#fff"
            />
          </View>
        )}
      </View>

      {/* Track Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.duration}>{formatTime(track.duration)}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onFavoritePress(track.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#e74c3c' : '#95a5a6'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    paddingRight: 12,
  },
  containerPlaying: {
    backgroundColor: '#e8f4f8',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
  },
  playingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  artist: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 11,
    color: '#95a5a6',
  },
  favoriteButton: {
    padding: 4,
  },
});
