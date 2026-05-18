import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePlayerStore } from '../../store/playerStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { ControlButton, PlayPauseButton, FavoriteButton } from '../../components/index';
import { formatTime } from '../../utils/formatters';
import { trackAPI } from '../../api';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { MOCK_TRACKS } from '../../api/mockData';

type Props = StackScreenProps<RootStackParamList, 'Player'>;

/**
 * PlayerScreen - Full-screen player with track details and controls
 */
const PlayerScreen: React.FC<Props> = ({ navigation }) => {
  const playerStore = usePlayerStore();
  const favoritesStore = useFavoritesStore();

  const currentTrack = MOCK_TRACKS.find((t) => t.id === playerStore.currentTrackId);

  const handlePlayPause = useCallback(() => {
    playerStore.togglePlayPause();
  }, [playerStore]);

  const handlePrevious = useCallback(() => {
    playerStore.playPrevious();
  }, [playerStore]);

  const handleNext = useCallback(() => {
    playerStore.playNext();
  }, [playerStore]);

  const handleSeek = useCallback(
    (value: number) => {
      playerStore.seekTo(value);
    },
    [playerStore]
  );

  const handleFavoriteToggle = useCallback(() => {
    if (currentTrack) {
      favoritesStore.toggleFavorite(currentTrack.id);
    }
  }, [currentTrack, favoritesStore]);

  const handleArtistPress = useCallback(() => {
    if (currentTrack) {
      navigation.navigate('Artist', { artistId: currentTrack.artistId });
    }
  }, [currentTrack, navigation]);

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-down" size={32} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.noTrackText}>No track playing</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorite = favoritesStore.isFavorite(currentTrack.id);
  const progressPercent =
    playerStore.duration > 0
      ? (playerStore.progress / playerStore.duration) * 100
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-down" size={32} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Album Art */}
        <View style={styles.albumContainer}>
          <Image
            source={{ uri: currentTrack.coverUrl }}
            style={styles.albumArt}
          />
        </View>

        {/* Track Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{currentTrack.title}</Text>
            <FavoriteButton
              isFavorite={isFavorite}
              onPress={handleFavoriteToggle}
              size={28}
            />
          </View>

          <TouchableOpacity onPress={handleArtistPress}>
            <Text style={styles.artist}>{currentTrack.artist}</Text>
          </TouchableOpacity>

          <Text style={styles.genre}>{currentTrack.genre}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <TouchableOpacity
            style={styles.progressBar}
            onPress={(event: GestureResponderEvent) => {
              const { locationX } = event.nativeEvent;
              const percentage = locationX / (screenWidth - 32);
              const newProgress = percentage * playerStore.duration;
              handleSeek(newProgress);
            }}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    playerStore.duration > 0
                      ? `${(playerStore.progress / playerStore.duration) * 100}%`
                      : '0%',
                },
              ]}
            />
            <View
              style={[
                styles.progressThumb,
                {
                  left:
                    playerStore.duration > 0
                      ? `${(playerStore.progress / playerStore.duration) * 100}%`
                      : '0%',
                },
              ]}
            />
          </TouchableOpacity>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(playerStore.progress)}</Text>
            <Text style={styles.time}>{formatTime(playerStore.duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <ControlButton
            icon="skip-previous"
            onPress={handlePrevious}
            size={44}
            disabled={playerStore.currentTrackIndex === 0}
          />

          <PlayPauseButton
            isPlaying={playerStore.isPlaying}
            onPress={handlePlayPause}
            size={64}
          />

          <ControlButton
            icon="skip-next"
            onPress={handleNext}
            size={44}
            disabled={
              playerStore.currentTrackIndex >= playerStore.queue.length - 1
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const albumSize = screenWidth - 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  albumArt: {
    width: albumSize,
    height: albumSize,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  infoContainer: {
    marginVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
  },
  artist: {
    fontSize: 16,
    color: '#3498db',
    marginTop: 8,
    fontWeight: '500',
  },
  genre: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
  progressContainer: {
    marginVertical: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ecf0f1',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 2,
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
    position: 'absolute',
    top: -4,
    marginLeft: -6,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 20,
  },
  noTrackText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default PlayerScreen;
