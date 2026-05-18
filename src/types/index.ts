export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  genre: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  followers: number;
  photoUrl: string;
  tracks: Track[];
}

export interface User {
  email: string;
  lastPlayingTrackId: string | null;
  lastPlayingTrackPaused: boolean;
  lastScreen: string;
}

export interface PlayerState {
  currentTrackId: string | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTrackIndex: number;
  queue: Track[];
}

export interface FavoritesState {
  favorites: string[]; // track IDs
}

export interface SessionState {
  lastScreen: string | null;
  lastPlayingTrackId: string | null;
  lastPlayingTrackPaused: boolean;
}
