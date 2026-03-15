import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENTLY_PLAYED_KEY = 'recently_played_songs';
const MAX_RECENTLY_PLAYED = 10;

export interface PlayedSong {
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
  playedAt: number; // timestamp
}

export const recentlyPlayedService = {
  // Get all recently played songs
  async getRecentlyPlayed(): Promise<PlayedSong[]> {
    try {
      const data = await AsyncStorage.getItem(RECENTLY_PLAYED_KEY);
      if (data) {
        const songs = JSON.parse(data) as PlayedSong[];
        console.log('[recentlyPlayedService] Retrieved songs:', songs.map(s => ({ id: s.id, name: s.name, hasDownloadUrl: !!s.downloadUrl })));
        // Sort by most recent first
        return songs.sort((a, b) => b.playedAt - a.playedAt);
      }
      return [];
    } catch (error) {
      console.error('Error getting recently played songs:', error);
      return [];
    }
  },

  // Add a song to recently played
  async addRecentlyPlayed(song: Omit<PlayedSong, 'playedAt'>): Promise<void> {
    try {
      console.log('[recentlyPlayedService] Adding song with downloadUrl:', song.downloadUrl);
      const existingSongs = await this.getRecentlyPlayed();
      
      // Remove if song already exists (to avoid duplicates)
      const filteredSongs = existingSongs.filter(s => s.id !== song.id);
      
      // Add new song with current timestamp
      const newSong: PlayedSong = {
        ...song,
        playedAt: Date.now(),
      };
      
      console.log('[recentlyPlayedService] newSong to be saved:', { id: newSong.id, name: newSong.name, hasDownloadUrl: !!newSong.downloadUrl, downloadUrl: newSong.downloadUrl });
      
      const updatedSongs = [newSong, ...filteredSongs].slice(0, MAX_RECENTLY_PLAYED);
      
      await AsyncStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(updatedSongs));
      console.log('[recentlyPlayedService] Added song to recently played:', song.name);
    } catch (error) {
      console.error('Error adding recently played song:', error);
    }
  },

  // Clear all recently played songs
  async clearRecentlyPlayed(): Promise<void> {
    try {
      await AsyncStorage.removeItem(RECENTLY_PLAYED_KEY);
      console.log('[recentlyPlayedService] Cleared recently played songs');
    } catch (error) {
      console.error('Error clearing recently played songs:', error);
    }
  },
};
