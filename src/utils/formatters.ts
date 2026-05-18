/**
 * Format seconds to MM:SS
 */
export const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Format large numbers with K, M suffix
 */
export const formatFollowers = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Get unique genres from tracks
 */
export const getUniqueGenres = (tracks: any[]): string[] => {
  const genres = new Set(tracks.map((t) => t.genre));
  return Array.from(genres);
};

/**
 * Sort tracks by title
 */
export const sortTracksByTitle = (tracks: any[]): any[] => {
  return [...tracks].sort((a, b) => a.title.localeCompare(b.title));
};

/**
 * Sort tracks by artist
 */
export const sortTracksByArtist = (tracks: any[]): any[] => {
  return [...tracks].sort((a, b) => a.artist.localeCompare(b.artist));
};
