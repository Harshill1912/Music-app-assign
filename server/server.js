const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock track data with real URLs
const tracks = [
  {
    id: '1',
    title: 'Ambient Beauty',
    artist: 'Aurora Waves',
    duration: 360,
    coverUrl: 'https://picsum.photos/300/300?random=1',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Ambient',
  },
  {
    id: '2',
    title: 'Electric Dreams',
    artist: 'Neon Lights',
    duration: 245,
    coverUrl: 'https://picsum.photos/300/300?random=2',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Electronic',
  },
  {
    id: '3',
    title: 'Sunset Horizon',
    artist: 'Aurora Waves',
    duration: 280,
    coverUrl: 'https://picsum.photos/300/300?random=3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Ambient',
  },
  {
    id: '4',
    title: 'Midnight Pulse',
    artist: 'Synthetic Echo',
    duration: 220,
    coverUrl: 'https://picsum.photos/300/300?random=4',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Synthwave',
  },
  {
    id: '5',
    title: 'Urban Rhythm',
    artist: 'City Beats',
    duration: 210,
    coverUrl: 'https://picsum.photos/300/300?random=5',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Hip-Hop',
  },
  {
    id: '6',
    title: 'Cosmic Journey',
    artist: 'Aurora Waves',
    duration: 320,
    coverUrl: 'https://picsum.photos/300/300?random=6',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Ambient',
  },
  {
    id: '7',
    title: 'Neon City',
    artist: 'Neon Lights',
    duration: 235,
    coverUrl: 'https://picsum.photos/300/300?random=7',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'Electronic',
  },
  {
    id: '8',
    title: 'Digital Echoes',
    artist: 'Synthetic Echo',
    duration: 265,
    coverUrl: 'https://picsum.photos/300/300?random=8',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Synthwave',
  },
  {
    id: '9',
    title: 'Groove Factory',
    artist: 'City Beats',
    duration: 195,
    coverUrl: 'https://picsum.photos/300/300?random=9',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    genre: 'Hip-Hop',
  },
  {
    id: '10',
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    duration: 420,
    coverUrl: 'https://picsum.photos/300/300?random=10',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'Ambient',
  },
  {
    id: '11',
    title: 'Starlight',
    artist: 'Neon Lights',
    duration: 290,
    coverUrl: 'https://picsum.photos/300/300?random=11',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    genre: 'Electronic',
  },
  {
    id: '12',
    title: 'Retro Vibes',
    artist: 'Synthetic Echo',
    duration: 240,
    coverUrl: 'https://picsum.photos/300/300?random=12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    genre: 'Synthwave',
  },
  {
    id: '13',
    title: 'Beat Drop',
    artist: 'City Beats',
    duration: 215,
    coverUrl: 'https://picsum.photos/300/300?random=13',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    genre: 'Hip-Hop',
  },
  {
    id: '14',
    title: 'Silent Night',
    artist: 'Nature Sounds',
    duration: 380,
    coverUrl: 'https://picsum.photos/300/300?random=14',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    genre: 'Ambient',
  },
  {
    id: '15',
    title: 'Future Sounds',
    artist: 'Aurora Waves',
    duration: 255,
    coverUrl: 'https://picsum.photos/300/300?random=15',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    genre: 'Ambient',
  },
];

/**
 * GET /tracks
 * Returns list of all tracks
 */
app.get('/tracks', (req, res) => {
  res.json(tracks);
});

/**
 * GET /tracks/featured
 * Returns featured tracks (first 5)
 */
app.get('/tracks/featured', (req, res) => {
  res.json(tracks.slice(0, 5));
});

/**
 * GET /stream/:trackId
 * Streams audio file with HTTP range support
 * Optimized for low latency playback with 64KB chunks
 */
app.get('/stream/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const track = tracks.find((t) => t.id === trackId);

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Get the audio file from remote URL
    const audioUrl = track.audioUrl;

    // Set proper headers for streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache');

    // Fetch the audio file and stream it
    const response = await axios.get(audioUrl, {
      responseType: 'stream',
      timeout: 30000,
      headers: {
        'User-Agent': 'Music-App/1.0',
      },
    });

    // Set content length if available
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }

    // Pipe the stream with 64KB buffer chunks
    response.data.pipe(res);

    response.data.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Stream error' });
      }
    });
  } catch (error) {
    console.error('Streaming error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to stream audio' });
    }
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Music App Server is running' });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Music App Backend Server',
    version: '1.0.0',
    endpoints: {
      tracks: 'GET /tracks',
      featured: 'GET /tracks/featured',
      stream: 'GET /stream/:trackId',
      health: 'GET /health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Music App Server running on http://localhost:${PORT}`);
  console.log(`📊 Track data available at http://localhost:${PORT}/tracks`);
  console.log(`🎶 Audio streaming enabled at http://localhost:${PORT}/stream/:trackId`);
});
