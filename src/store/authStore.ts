import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  setUser: (user: User) => void;
  updateLastPlayingTrack: (trackId: string | null, isPaused: boolean) => Promise<void>;
  updateLastScreen: (screen: string) => Promise<void>;
}

const USER_KEY = '@music_app_user';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      // Mock authentication - any email and password work
      const user: User = {
        email,
        lastPlayingTrackId: null,
        lastPlayingTrackPaused: true,
        lastScreen: 'Home',
      };

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      set({
        user,
        isLoggedIn: true,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      set({
        user: null,
        isLoggedIn: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  checkSession: async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_KEY);
      if (stored) {
        const user: User = JSON.parse(stored);
        set({
          user,
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Session check failed:', error);
      set({ isLoading: false });
    }
  },

  setUser: (user: User) => {
    set({ user });
  },

  updateLastPlayingTrack: async (trackId: string | null, isPaused: boolean) => {
    const state = get();
    if (state.user) {
      const updatedUser: User = {
        ...state.user,
        lastPlayingTrackId: trackId,
        lastPlayingTrackPaused: isPaused,
      };
      try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        set({ user: updatedUser });
      } catch (error) {
        console.error('Failed to update last playing track:', error);
      }
    }
  },

  updateLastScreen: async (screen: string) => {
    const state = get();
    if (state.user) {
      const updatedUser: User = {
        ...state.user,
        lastScreen: screen,
      };
      try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        set({ user: updatedUser });
      } catch (error) {
        console.error('Failed to update last screen:', error);
      }
    }
  },
}));
