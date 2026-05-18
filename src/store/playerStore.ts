import { create } from 'zustand';
import { Track, PlayerState } from '../types';

interface PlayerStore extends PlayerState {
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (tracks: Track[]) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  stop: () => void;
  seekTo: (position: number) => void;
  reset: () => void;
}

const initialState: PlayerState = {
  currentTrackId: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  currentTrackIndex: 0,
  queue: [],
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,

  setCurrentTrack: (track: Track | null) => {
    if (track) {
      set((state) => ({
        currentTrackId: track.id,
        currentTrackIndex: state.queue.findIndex((t) => t.id === track.id),
        isPlaying: true,
        progress: 0,
        duration: track.duration,
      }));
    } else {
      set({
        currentTrackId: null,
        isPlaying: false,
        progress: 0,
      });
    }
  },

  setQueue: (tracks: Track[]) => {
    set({ queue: tracks });
  },

  play: () => {
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  togglePlayPause: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  setProgress: (progress: number) => {
    set({ progress });
  },

  setDuration: (duration: number) => {
    set({ duration });
  },

  playNext: () => {
    const state = get();
    const nextIndex = state.currentTrackIndex + 1;

    if (nextIndex < state.queue.length) {
      const nextTrack = state.queue[nextIndex];
      set({
        currentTrackId: nextTrack.id,
        currentTrackIndex: nextIndex,
        progress: 0,
        duration: nextTrack.duration,
        isPlaying: true,
      });
    } else {
      // Loop back to start
      if (state.queue.length > 0) {
        const firstTrack = state.queue[0];
        set({
          currentTrackId: firstTrack.id,
          currentTrackIndex: 0,
          progress: 0,
          duration: firstTrack.duration,
          isPlaying: true,
        });
      }
    }
  },

  playPrevious: () => {
    const state = get();
    const previousIndex = Math.max(0, state.currentTrackIndex - 1);

    if (previousIndex >= 0 && previousIndex < state.queue.length) {
      const previousTrack = state.queue[previousIndex];
      set({
        currentTrackId: previousTrack.id,
        currentTrackIndex: previousIndex,
        progress: 0,
        duration: previousTrack.duration,
        isPlaying: true,
      });
    }
  },

  stop: () => {
    set({
      currentTrackId: null,
      isPlaying: false,
      progress: 0,
    });
  },

  seekTo: (position: number) => {
    set({ progress: position });
  },

  reset: () => {
    set(initialState);
  },
}));
