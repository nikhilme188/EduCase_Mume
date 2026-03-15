import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Song } from '../types/song';
import audioService from '../services/audioService';
import { recentlyPlayedService } from '../api/recentlyPlayedService';
import { mostPlayedService } from '../api/mostPlayedService';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  currentTime: number;
  duration: number;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  currentTime: 0,
  duration: 0,
};


export const togglePlayPauseAsync = createAsyncThunk(
  'player/togglePlayPause',
  async (_, { getState }) => {
    const state = getState() as { player: PlayerState };
    const currentState = state.player;
    
    if (currentState.isPlaying) {
      await audioService.pause();
    } else if (currentState.currentSong) {
      await audioService.play();
    }
    
    return !currentState.isPlaying;
  }
);

export const pauseAsync = createAsyncThunk(
  'player/pause',
  async (_, { getState }) => {
    const state = getState() as { player: PlayerState };
    const currentState = state.player;
    
    if (currentState.isPlaying) {
      await audioService.pause();
    }
    
    return false;
  }
);

export const setCurrentSongWithTracking = createAsyncThunk(
  'player/setCurrentSongWithTracking',
  async (payload: { song: Song; queue: Song[] }, { dispatch }) => {
    const { song, queue } = payload;
    
    console.log('[playerSlice] setCurrentSongWithTracking called for:', song.name, song.id);
    console.log('[playerSlice] Song data:', {
      id: song.id,
      name: song.name,
      hasImage: !!song.image,
      hasArtists: !!song.artists,
      hasDownloadUrl: !!song.downloadUrl,
      downloadUrl: song.downloadUrl,
    });
    
    try {
      // Track in recently played
      console.log('[playerSlice] Adding to recently played...');
      await recentlyPlayedService.addRecentlyPlayed({
        id: song.id,
        name: song.name,
        image: song.image,
        downloadUrl: song.downloadUrl,
        artists: song.artists,
      });
      console.log('[playerSlice] Successfully added to recently played');
      
      // Track in most played (increment play count)
      console.log('[playerSlice] Adding to most played...');
      await mostPlayedService.addPlayCount({
        id: song.id,
        name: song.name,
        image: song.image,
        downloadUrl: song.downloadUrl,
        artists: song.artists,
      });
      console.log('[playerSlice] Successfully added to most played');
      
      console.log('[playerSlice] ✅ Tracked play for song:', song.name);
    } catch (error) {
      console.error('[playerSlice] ❌ Error tracking play count:', error);
    }
    
    // Return the payload to be used in the reducer
    return payload;
  }
);

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<{ song: Song; queue: Song[] }>) => {
      state.currentSong = action.payload.song;
      state.queue = action.payload.queue;
      state.currentIndex = action.payload.queue.findIndex((s) => s.id === action.payload.song.id);
      state.isPlaying = true;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    playNext: (state) => {
      if (state.queue.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.queue.length;
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
      }
    },
    playPrevious: (state) => {
      if (state.queue.length > 0) {
        state.currentIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
      }
    },
    clearPlayer: (state) => {
      state.currentSong = null;
      state.isPlaying = false;
      state.queue = [];
      state.currentIndex = 0;
      state.currentTime = 0;
      state.duration = 0;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(togglePlayPauseAsync.fulfilled, (state, action) => {
      state.isPlaying = action.payload;
    });
    builder.addCase(pauseAsync.fulfilled, (state, action) => {
      state.isPlaying = action.payload;
    });
    builder.addCase(setCurrentSongWithTracking.fulfilled, (state, action) => {
      state.currentSong = action.payload.song;
      state.queue = action.payload.queue;
      state.currentIndex = action.payload.queue.findIndex((s) => s.id === action.payload.song.id);
      state.isPlaying = true;
    });
  },
});

export const {
  setCurrentSong,
  togglePlayPause,
  setIsPlaying,
  playNext,
  playPrevious,
  clearPlayer,
  setCurrentTime,
  setDuration,
} = playerSlice.actions;

export default playerSlice.reducer;
