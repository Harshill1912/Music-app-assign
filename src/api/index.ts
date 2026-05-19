import axios from 'axios';
import Constants from 'expo-constants';
import { Track, Artist } from '../types';
import { MOCK_TRACKS, MOCK_ARTISTS, FEATURED_TRACKS } from './mockData';

const getApiBaseUrl = () => {
  const constants = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    manifest?: { debuggerHost?: string };
    manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } };
  };
  const hostUri =
    constants.expoConfig?.hostUri ||
    constants.manifest?.debuggerHost ||
    constants.manifest2?.extra?.expoGo?.debuggerHost;
  const host = hostUri?.split(':')[0];

  return host ? `http://${host}:3001` : 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const trackAPI = {
  /**
   * Fetch all tracks
   */
  getAllTracks: async (): Promise<Track[]> => {
    try {
      const response = await apiClient.get('/tracks');
      return response.data;
    } catch (error) {
      // Fallback to mock data if server is unavailable
      console.log('Server unavailable, using mock data');
      return MOCK_TRACKS;
    }
  },

  /**
   * Fetch featured tracks
   */
  getFeaturedTracks: async (): Promise<Track[]> => {
    try {
      const response = await apiClient.get('/tracks/featured');
      return response.data;
    } catch (error) {
      console.log('Server unavailable, using mock featured data');
      return FEATURED_TRACKS;
    }
  },

  /**
   * Get a single track by ID
   */
  getTrackById: async (trackId: string): Promise<Track | null> => {
    const track = MOCK_TRACKS.find((t) => t.id === trackId);
    return track || null;
  },

  /**
   * Get tracks by genre
   */
  getTracksByGenre: async (genre: string): Promise<Track[]> => {
    return MOCK_TRACKS.filter((t) => t.genre.toLowerCase() === genre.toLowerCase());
  },
};

export const artistAPI = {
  /**
   * Fetch all artists
   */
  getAllArtists: async (): Promise<Artist[]> => {
    return MOCK_ARTISTS;
  },

  /**
   * Get a single artist by ID
   */
  getArtistById: async (artistId: string): Promise<Artist | null> => {
    const artist = MOCK_ARTISTS.find((a) => a.id === artistId);
    return artist || null;
  },

  /**
   * Get artist's tracks
   */
  getArtistTracks: async (artistId: string): Promise<Track[]> => {
    const artist = MOCK_ARTISTS.find((a) => a.id === artistId);
    return artist?.tracks || [];
  },
};

/**
 * Get audio stream URL for a track
 * When server is available, uses streaming endpoint
 */
export const getAudioStreamUrl = (trackId: string): string => {
  return `${API_BASE_URL}/stream/${trackId}`;
};

export default {
  trackAPI,
  artistAPI,
  getAudioStreamUrl,
};
