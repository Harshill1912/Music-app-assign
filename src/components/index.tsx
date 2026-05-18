import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * LoadingIndicator - shows a loading spinner with optional text
 */
export const LoadingIndicator: React.FC<{ message?: string }> = ({ message }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#3498db" />
    {message && <Text style={styles.text}>{message}</Text>}
  </View>
);

/**
 * ErrorMessage - displays error with optional retry button
 */
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <View style={styles.errorContainer}>
    <MaterialCommunityIcons
      name="alert-circle"
      size={48}
      color="#e74c3c"
    />
    <Text style={styles.errorTitle}>Something went wrong</Text>
    <Text style={styles.errorMessage}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    )}
  </View>
);

/**
 * EmptyState - displays when there's no data
 */
interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'inbox',
}) => (
  <View style={styles.emptyContainer}>
    <MaterialCommunityIcons
      name={icon}
      size={48}
      color="#bdc3c7"
    />
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyMessage}>{message}</Text>
  </View>
);

/**
 * FavoriteButton - reusable favorite toggle button
 */
interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onPress,
  size = 24,
}) => (
  <TouchableOpacity
    style={styles.favoriteBtn}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <MaterialCommunityIcons
      name={isFavorite ? 'heart' : 'heart-outline'}
      size={size}
      color={isFavorite ? '#e74c3c' : '#95a5a6'}
    />
  </TouchableOpacity>
);

/**
 * PlayPauseButton - large circular play/pause button
 */
interface PlayPauseButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  size?: number;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onPress,
  size = 60,
}) => (
  <TouchableOpacity
    style={[styles.playPauseBtn, { width: size, height: size }]}
    onPress={onPress}
  >
    <MaterialCommunityIcons
      name={isPlaying ? 'pause' : 'play'}
      size={size * 0.4}
      color="#fff"
    />
  </TouchableOpacity>
);

/**
 * ControlButton - generic circular control button
 */
interface ControlButtonProps {
  icon: string;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  icon,
  onPress,
  size = 44,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[
      styles.controlBtn,
      { width: size, height: size },
      disabled && styles.controlBtnDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <MaterialCommunityIcons
      name={icon}
      size={size * 0.4}
      color={disabled ? '#bdc3c7' : '#2c3e50'}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#7f8c8d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 12,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
    textAlign: 'center',
  },
  favoriteBtn: {
    padding: 8,
  },
  playPauseBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#3498db',
  },
  controlBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#ecf0f1',
  },
  controlBtnDisabled: {
    backgroundColor: '#e8eef2',
  },
});
