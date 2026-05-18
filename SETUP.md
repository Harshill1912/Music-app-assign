## 🚀 Music App - Complete Setup Guide

This guide walks you through setting up and running the Music App locally.

### Prerequisites
- Node.js 16 or higher (check: `node --version`)
- npm or yarn (check: `npm --version`)
- iOS Simulator (macOS) OR Android Emulator
- OR Expo Go app on physical device

### Step 1: Clone/Extract Project
```bash
cd Music-App
```

### Step 2: Install Dependencies

#### Option A: Automatic (Recommended)
**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
start.bat
```

#### Option B: Manual Installation
```bash
# Install frontend dependencies
npm install

# Install backend dependencies  
cd server
npm install
cd ..
```

### Step 3: Start Backend Server (Terminal 1)
```bash
cd server
npm start
```

Expected output:
```
🎵 Music App Server running on http://localhost:3001
📊 Track data available at http://localhost:3001/tracks
🎶 Audio streaming enabled at http://localhost:3001/stream/:trackId
```

### Step 4: Start Frontend App (Terminal 2)
```bash
npm start
```

Then choose your platform:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web (Expo Web)
- Or scan QR code with Expo Go on physical device

### Step 5: Test the App

**Login Screen:**
- Email: `test@example.com`
- Password: `password123`
- (Any email/password works in demo mode)

**Home Screen:**
- Scroll featured tracks horizontally
- Scroll all tracks vertically
- Tap heart icon to favorite tracks
- Tap any track to play

**Player Screen:**
- Tap mini player at bottom to open full player
- Use play/pause button
- Slide progress bar to seek
- Previous/next buttons to skip
- Tap artist name to view artist profile

**Artist Profile:**
- See artist details
- Browse their tracks
- Play tracks from their collection

**Favorites Screen:**
- View all favorited tracks
- Remove by tapping heart
- Favorites persist after app restart

### Troubleshooting

#### Issue: "Cannot find module" errors
**Solution:** Make sure you ran `npm install`
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Server won't start
**Solution:** Check if port 3001 is already in use
```bash
# Find process on port 3001
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill process and try again
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### Issue: Expo won't start
**Solution:** Update Expo CLI
```bash
npm install -g expo-cli@latest
npm install expo@latest
```

#### Issue: "CORS error" or "Cannot connect to server"
**Solution:** The app will automatically fall back to mock data. This is normal for development without the backend.

### Detailed Feature Walkthrough

#### 1. Session Persistence
1. Log in with any credentials
2. Close the app completely
3. Reopen the app
4. ✅ App should skip login and show home screen

#### 2. Playing Tracks
1. Tap any track on home screen
2. Mini player appears at bottom
3. Tap mini player to open full player
4. ✅ Track plays with progress indicator
5. Tap next/previous to skip tracks
6. Tap progress bar to seek

#### 3. Favorites System
1. Tap heart icon on any track
2. Heart turns red
3. Go to Favorites tab
4. ✅ Favorited track appears in list
5. Close app completely
6. Reopen app
7. ✅ Favorites are still there

#### 4. Artist Profiles
1. Tap artist name anywhere (home, favorites, player)
2. ✅ Opens artist profile screen
3. See artist photo, followers, bio
4. Tap track to play from this artist's list
5. Return to previous screen with back button

#### 5. Loading States
1. Check network > Airplane Mode (turn on)
2. ✅ App shows loading then falls back to mock data
3. Turn airplane mode off
4. ✅ App should work normally

### Project Configuration Files

#### App.tsx
- App entry point
- Initializes stores and sessions
- Handles splash screen

#### app.json
- Expo configuration
- App metadata and permissions
- Platform-specific settings

#### tsconfig.json
- TypeScript strict mode enabled
- Path aliases for cleaner imports
- Modern ES2020 target

#### .gitignore
- Excludes node_modules, build outputs
- Local environment files
- Platform-specific files

### Backend Endpoints Reference

All endpoints available at `http://localhost:3001`:

```
GET /
  Response: API documentation

GET /health
  Response: { status: "ok" }

GET /tracks
  Response: Array of all 15 tracks

GET /tracks/featured
  Response: Array of 5 featured tracks

GET /stream/:trackId
  Response: MP3 audio stream
  Headers: Accept-Ranges: bytes
  Note: Supports HTTP range requests for seeking
```

### Development Tips

#### View App Logs
```bash
# From Expo terminal, press 'j' to open debugger
# Or in terminal:
npm run logs
```

#### Debug Redux/Zustand Store
Add this to App.tsx temporarily:
```typescript
console.log('Player Store:', usePlayerStore.getState());
console.log('Auth Store:', useAuthStore.getState());
```

#### Test Different Screen Sizes
In Expo, press `d` to open device selector:
- iPhone 12
- iPhone 14 Pro
- iPad Pro
- Android phone sizes

#### Enable Network Throttling
1. Open React Native Debugger
2. Network tab
3. Set throttling to test slow connections

### Production Build

#### Build for iOS (macOS only)
```bash
eas build --platform ios --build-type production
```

#### Build for Android
```bash
eas build --platform android --build-type production
```

#### Deploy Backend
```bash
cd server
npm install --production
# Deploy to Heroku, Railway, Vercel, etc.
```

### Performance Optimization Tips

1. **Images**: Using Picsum which caches by URL
2. **Audio**: Streaming from backend with 64KB chunks
3. **State**: Zustand re-renders only affected components
4. **Lists**: FlatList for virtualized rendering

### Code Quality Checklist

✅ TypeScript: 100% type coverage
✅ Component Size: All < 150 lines
✅ No inline styles
✅ Error handling on all screens
✅ Loading states everywhere
✅ Empty states for no data
✅ Meaningful variable names
✅ Comments on complex logic

### Common Questions

**Q: Do I need to run the server?**
A: No, but it's recommended. The app falls back to mock data if server is down.

**Q: Can I run on physical device?**
A: Yes! Install Expo Go app, scan QR code from `npm start` output.

**Q: How do I add more tracks?**
A: Edit `src/api/mockData.ts` and `server/server.js`.

**Q: How do I change styling?**
A: Edit individual StyleSheet.create() in each component.

**Q: How do I modify player behavior?**
A: Edit `src/store/playerStore.ts` and `src/hooks/index.ts`.

### Next Steps

1. ✅ App is running
2. ✅ Test all features
3. ✅ Review code in `src/` directory
4. ✅ Read comprehensive README.md
5. ✅ Check architecture decisions
6. ✅ Run on your device

### Support

For issues or questions, check:
- README.md for architecture details
- Code comments for implementation details
- src/types/index.ts for TypeScript interfaces
- server/server.js for backend logic

---

**Happy coding! 🎵**
