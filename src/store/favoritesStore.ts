import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesStore {
  favorites: Set<string>;
  isLoaded: boolean;
  loadFavorites: () => Promise<void>;
  addFavorite: (trackId: string) => Promise<void>;
  removeFavorite: (trackId: string) => Promise<void>;
  toggleFavorite: (trackId: string) => Promise<void>;
  isFavorite: (trackId: string) => boolean;
  getFavoriteIds: () => string[];
}

const FAVORITES_KEY = '@music_app_favorites';

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: new Set(),
  isLoaded: false,

  loadFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      const favoriteIds = stored ? JSON.parse(stored) : [];
      set({
        favorites: new Set(favoriteIds),
        isLoaded: true,
      });
    } catch (error) {
      console.error('Failed to load favorites:', error);
      set({ isLoaded: true });
    }
  },

  addFavorite: async (trackId: string) => {
    const state = get();
    const newFavorites = new Set(state.favorites);
    newFavorites.add(trackId);

    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
      set({ favorites: newFavorites });
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  },

  removeFavorite: async (trackId: string) => {
    const state = get();
    const newFavorites = new Set(state.favorites);
    newFavorites.delete(trackId);

    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
      set({ favorites: newFavorites });
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  },

  toggleFavorite: async (trackId: string) => {
    const state = get();
    if (state.favorites.has(trackId)) {
      await get().removeFavorite(trackId);
    } else {
      await get().addFavorite(trackId);
    }
  },

  isFavorite: (trackId: string) => {
    return get().favorites.has(trackId);
  },

  getFavoriteIds: () => {
    return Array.from(get().favorites);
  },
}));
