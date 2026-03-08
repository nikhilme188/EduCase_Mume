# Mume – Music Player App

Mume is a React Native music player application that streams songs using the Saavan API.  
The goal of this project is to provide a smooth music playback experience while keeping the code structure clean and maintainable.


## App Features

### Music Playback
- Play and pause songs
- Skip to next or previous tracks
- Seek to any position in a song
- Real-time progress bar with scrubbing
- Mini player for quick access from the home screen

### Music Browsing
The app allows users to explore music through multiple tabs:
- Songs
- Artists
- Albums
- Suggested tracks

### Theme Support
- Light mode and dark mode available
- The selected theme is saved locally so it remains the same after restarting the app

### Network-Aware Audio Quality
The app checks the current network connection and adjusts audio quality automatically:
- WiFi / 4G / 5G → Higher audio quality
- Slower networks → Lower bitrate for smoother playback

### Playback Persistence
If the user leaves the player screen and returns later, the app resumes the same song from the previous position instead of restarting.

---

## Architecture Overview

The project follows a modular structure to keep logic and UI separated.

- **Redux Store** manages global state such as the current song, playback status, and theme.
- **Custom Hooks** handle reusable logic like audio playback, progress tracking, and API data fetching.
- **Reusable Components** split the UI into smaller parts like album artwork, player controls, and song details.
- **Service Layer** handles audio playback through a dedicated audio service.

This structure makes the code easier to maintain and extend.

---

## Key Technical Decisions

### Redux for State Management
Redux Toolkit is used to manage player state and theme settings.  
Since multiple screens interact with the music player, centralized state management helps keep the behavior predictable.

### Custom Hooks
Logic is separated into reusable hooks:

- `useAudioPlayback` – handles song loading and playback
- `useProgressTracking` – manages song progress updates
- `useTheme` – handles theme switching
- `useSongs` – fetches songs from the API

This approach keeps UI components cleaner and easier to understand.

### Audio Service Layer
Audio playback is implemented through a service built on top of `react-native-sound`.  
This abstraction helps keep playback logic separate from UI components and makes it easier to replace the library later if needed.

### Component Separation
The player screen is divided into smaller components such as:
- PlayerHeader
- AlbumArt
- SongInfo
- PlayerControls

Each component has a clear responsibility which improves readability and maintainability.

---

## Project Structure
src/
├── api/            # API calls (Saavan API)
├── components/     # Reusable UI components
├── hooks/          # Custom hooks
├── navigation/     # Navigation setup
├── screens/        # App screens
├── services/       # Audio service
├── store/          # Redux store and slices
├── themes/         # Theme configuration
└── types/          # TypeScript types


---

## Technologies Used

- React Native
- Redux Toolkit
- React Navigation
- TypeScript
- react-native-sound
- NetInfo
- react-native-vector-icons

---

## How to Run the Project

### Requirements
- Node.js 18+
- React Native CLI
- Android Studio (for Android)
- Xcode and CocoaPods (for iOS)

---

### 1. Install Dependencies
Install Dependencies
1.npm install
2. Install iOS Pods (first time only)
cd ios
pod install
cd ..
3. Start Metro Server
npm start
4. Run on Android
npm run android
5. Run on iOS
npm run ios