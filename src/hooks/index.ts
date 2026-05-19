import { useEffect, useRef, useCallback, useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';
import { Track } from '../types';

/**
 * Hook for managing audio playback
 * Integrates with player store and handles track player lifecycle
 */
export const useAudioPlayback = () => {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const duration = usePlayerStore((state) => state.duration);
  const currentTrackId = usePlayerStore((state) => state.currentTrackId);
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);
  const updateLastPlayingTrack = useAuthStore((state) => state.updateLastPlayingTrack);
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
    if (isPlaying && duration > 0) {
      playbackIntervalRef.current = setInterval(() => {
        const state = usePlayerStore.getState();
        const newProgress = state.progress + 0.1;

        if (newProgress >= state.duration) {
          // Auto-play next track
          state.playNext();
          state.setProgress(0);
          return;
        }

        state.setProgress(newProgress);
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
  }, [isPlaying, duration]);

  const playTrack = useCallback(
    (track: Track) => {
      // Stop any currently playing track
      setCurrentTrack(track);
      // Save to session
      updateLastPlayingTrack(track.id, false);
    },
    [setCurrentTrack, updateLastPlayingTrack]
  );

  const pausePlayback = useCallback(() => {
    pause();
    if (currentTrackId) {
      updateLastPlayingTrack(currentTrackId, true);
    }
  }, [pause, currentTrackId, updateLastPlayingTrack]);

  const resumePlayback = useCallback(() => {
    play();
    if (currentTrackId) {
      updateLastPlayingTrack(currentTrackId, false);
    }
  }, [play, currentTrackId, updateLastPlayingTrack]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pausePlayback();
    } else {
      resumePlayback();
    }
  }, [isPlaying, pausePlayback, resumePlayback]);

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
  const updateLastScreen = useAuthStore((state) => state.updateLastScreen);

  useEffect(() => {
    updateLastScreen(screenName);
  }, [screenName, updateLastScreen]);
};
