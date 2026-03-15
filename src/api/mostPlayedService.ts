import AsyncStorage from '@react-native-async-storage/async-storage';

const MOST_PLAYED_KEY = 'most_played_songs';

export interface MostPlayedSong {
  id: string;
  name: string;
  image: Array<{
    quality: string;
    url: string;
  }>;
  downloadUrl?: Array<{
    quality: string;
    url: string;
  }>;
  artists?: {
    primary: Array<{
      name: string;
    }>;
  };
  playCount: number; // number of times played
  lastPlayedAt: number; // timestamp of last play
}

export const mostPlayedService = {
  // Get all most played songs (only songs played 3 or more times)
  async getMostPlayed(): Promise<MostPlayedSong[]> {
    try {
      const data = await AsyncStorage.getItem(MOST_PLAYED_KEY);
      if (data) {
        const songs = JSON.parse(data) as MostPlayedSong[];
        console.log('[mostPlayedService] Total stored songs:', songs.length);
        console.log('[mostPlayedService] All stored songs:', songs.map(s => ({name: s.name, playCount: s.playCount})));
        // Filter: only songs with playCount >= 3
        const filteredSongs = songs.filter(song => song.playCount >= 3);
        console.log('[mostPlayedService] Filtered songs (playCount >= 3):', filteredSongs.length);
        // Sort by play count (descending), then by last played time
        return filteredSongs.sort((a, b) => {
          if (b.playCount !== a.playCount) {
            return b.playCount - a.playCount;
          }
          return b.lastPlayedAt - a.lastPlayedAt;
        });
      }
      console.log('[mostPlayedService] No data found in AsyncStorage');
      return [];
    } catch (error) {
      console.error('[mostPlayedService] Error getting most played songs:', error);
      return [];
    }
  },

  // Get top N most played songs (only songs played 3 or more times)
  async getTopMostPlayed(limit: number = 10): Promise<MostPlayedSong[]> {
    try {
      const allSongs = await this.getMostPlayed();
      return allSongs.slice(0, limit);
    } catch (error) {
      console.error('[mostPlayedService] Error getting top most played songs:', error);
      return [];
    }
  },

  // Debug: Get ALL songs including those with playCount < 4
  async getAllSongsDebug(): Promise<MostPlayedSong[]> {
    try {
      const data = await AsyncStorage.getItem(MOST_PLAYED_KEY);
      if (data) {
        const songs = JSON.parse(data) as MostPlayedSong[];
        return songs.sort((a, b) => b.playCount - a.playCount);
      }
      return [];
    } catch (error) {
      console.error('[mostPlayedService] Error getting all songs debug:', error);
      return [];
    }
  },

  // Increment play count for a song
  async addPlayCount(song: Omit<MostPlayedSong, 'playCount' | 'lastPlayedAt'>): Promise<void> {
    try {
      const allSongs = await this.getMostPlayed();
      
      // Find existing song (search in ALL songs, not filtered)
      const data = await AsyncStorage.getItem(MOST_PLAYED_KEY);
      const allStoredSongs = data ? JSON.parse(data) as MostPlayedSong[] : [];
      
      const existingSongIndex = allStoredSongs.findIndex(s => s.id === song.id);
      
      if (existingSongIndex >= 0) {
        // Increment play count
        allStoredSongs[existingSongIndex].playCount += 1;
        allStoredSongs[existingSongIndex].lastPlayedAt = Date.now();
        console.log('[mostPlayedService] Updated song:', song.name, 'playCount:', allStoredSongs[existingSongIndex].playCount);
      } else {
        // Add new song with play count = 1
        const newSong: MostPlayedSong = {
          ...song,
          playCount: 1,
          lastPlayedAt: Date.now(),
        };
        allStoredSongs.push(newSong);
        console.log('[mostPlayedService] Added new song:', song.name, 'playCount: 1');
      }
      
      await AsyncStorage.setItem(MOST_PLAYED_KEY, JSON.stringify(allStoredSongs));
      console.log('[mostPlayedService] Total stored songs:', allStoredSongs.length);
      console.log('[mostPlayedService] Stored songs:', allStoredSongs.map(s => ({name: s.name, playCount: s.playCount})));
    } catch (error) {
      console.error('[mostPlayedService] Error adding play count:', error);
    }
  },

  // Clear all most played songs
  async clearMostPlayed(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MOST_PLAYED_KEY);
      console.log('[mostPlayedService] Cleared most played songs');
    } catch (error) {
      console.error('[mostPlayedService] Error clearing most played songs:', error);
    }
  },
};
