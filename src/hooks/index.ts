import { useEffect, useRef, useCallback, useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';
import { Track } from '../types';

/**
 * Hook for managing audio playback
 * Integrates with player store and handles track player lifecycle
 */
export const useAudioPlayback = () => {
  const playerStore = usePlayerStore();
  const authStore = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize playback
  useEffect(() => {
    setIsReady(true);

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  // Simulate progress updates
  useEffect(() => {
    if (playerStore.isPlaying && playerStore.duration > 0) {
      playbackIntervalRef.current = setInterval(() => {
        playerStore.setProgress((prev) => {
          const newProgress = prev + 0.1;
          if (newProgress >= playerStore.duration) {
            // Auto-play next track
            playerStore.playNext();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [playerStore.isPlaying, playerStore.duration]);

  const playTrack = useCallback(
    (track: Track) => {
      // Stop any currently playing track
      playerStore.setCurrentTrack(track);
      // Save to session
      authStore.updateLastPlayingTrack(track.id, false);
    },
    [playerStore, authStore]
  );

  const pausePlayback = useCallback(() => {
    playerStore.pause();
    if (playerStore.currentTrackId) {
      authStore.updateLastPlayingTrack(playerStore.currentTrackId, true);
    }
  }, [playerStore, authStore]);

  const resumePlayback = useCallback(() => {
    playerStore.play();
    if (playerStore.currentTrackId) {
      authStore.updateLastPlayingTrack(playerStore.currentTrackId, false);
    }
  }, [playerStore, authStore]);

  const togglePlayPause = useCallback(() => {
    if (playerStore.isPlaying) {
      pausePlayback();
    } else {
      resumePlayback();
    }
  }, [playerStore.isPlaying, pausePlayback, resumePlayback]);

  return {
    isReady,
    playTrack,
    pausePlayback,
    resumePlayback,
    togglePlayPause,
  };
};

/**
 * Hook for fetching tracks with loading and error states
 */
export const useTrackFetch = (fetchFn: () => Promise<Track[]>) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchFn();
        setTracks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tracks');
        setTracks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, [fetchFn]);

  return {
    tracks,
    isLoading,
    error,
  };
};

/**
 * Hook for updating last screen navigation
 */
export const useNavigationTracking = (screenName: string) => {
  const authStore = useAuthStore();

  useEffect(() => {
    authStore.updateLastScreen(screenName);
  }, [screenName, authStore]);
};
