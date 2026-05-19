import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Track } from '../types';

interface MiniPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onPlayPausePress: () => void;
  onPlayerPress: () => void;
}

/**
 * MiniPlayer - persistent bottom player bar
 */
export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  track,
  isPlaying,
  onPlayPausePress,
  onPlayerPress,
}) => {
  if (!track) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPlayerPress}
      activeOpacity={0.95}
    >
      <Image source={{ uri: track.coverUrl }} style={styles.cover} />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.playButton}
        onPress={onPlayPausePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={32}
          color="#3498db"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 64,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
  },
  artist: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
  },
  playButton: {
    marginLeft: 8,
  },
});
