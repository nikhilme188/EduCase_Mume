import { Song } from '../types/song';
import Sound from 'react-native-sound';
import NetInfo from '@react-native-community/netinfo';



interface ProgressInfo {
  position: number;
  duration: number;
}

type NetworkQuality = '320' | '256' | '192' | '128';

class AudioService {
  private isInitialized = false;
  private currentSound: Sound | null = null;
  private currentSongId: string | null = null;
  private isPlaying = false;

  async initialize() {
    if (this.isInitialized) return;
    try {
      Sound.setCategory('Playback', true);
      console.log('AudioService initialized');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio service:', error);
    }
  }

  async playSong(song: Song) {
    try {
      await this.initialize();
      
      const preferredQuality = await this.getNetworkQuality();
      const downloadUrl = this.getBestQualityDownloadUrl(song.downloadUrl, preferredQuality);
      
      if (!downloadUrl) {
        console.warn('No download URL available for song:', song.name);
        return;
      }

      console.log('🎵 Playing song:', song.name);
      console.log('📊 Quality available:', song.downloadUrl?.map(d => d.quality));
      console.log('🎯 Selected quality:', preferredQuality);
      console.log('⏱️ Duration:', song.duration, 'seconds');
      this.currentSongId = song.id;
      this.isPlaying = true;

     
      if (this.currentSound) {
        this.currentSound.release();
        this.currentSound = null;
      }

   
      this.currentSound = new Sound(downloadUrl, '', (error) => {
        if (error) {
          console.error('❌ Failed to load sound:', error);
          this.isPlaying = false;
          return;
        }
        
        console.log('✅ Sound loaded successfully');
        const duration = this.currentSound?.getDuration() || 0;
        console.log('⏳ Actual duration from player:', duration);
      
        this.currentSound?.play((success) => {
          if (!success) {
            console.error('❌ Failed to play sound');
            this.isPlaying = false;
          } else {
            console.log('▶️ Sound now playing');
          }
        });
      });
    } catch (error) {
      console.error('Error playing song:', error);
      this.isPlaying = false;
    }
  }

  async pause() {
    try {
      console.log('⏸️ Pausing playback');
      if (this.currentSound) {
        this.currentSound.pause();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }

  async play() {
    try {
      console.log('▶️ Resuming playback');
      if (this.currentSound) {
        this.currentSound.play();
        this.isPlaying = true;
      }
    } catch (error) {
      console.error('Error playing:', error);
    }
  }

  async skipToNext() {
    try {
      console.log('⏭️ Skipping to next song');
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  }

  async skipToPrevious() {
    try {
      console.log('⏮️ Skipping to previous song');
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  }

  async seek(position: number) {
    try {
      console.log('⏩ Seeking to position:', position);
      if (this.currentSound) {
        this.currentSound.setCurrentTime(position);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }

  async getPlayerState() {
    return this.isPlaying ? 'playing' : 'paused';
  }

  
  private async getNetworkQuality(): Promise<NetworkQuality> {
    try {
      const state = await NetInfo.fetch();
      
      console.log('📡 Network State:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details,
      });

      if (!state.isConnected || !state.isInternetReachable) {
        console.log('📡 No internet connection, using minimum quality (128kbps)');
        return '128';
      }

      
      switch (state.type) {
        case 'wifi':
          console.log('📡 WiFi detected, using highest quality (320kbps)');
          return '320';
        
        case 'cellular':
          
          if (state.details && 'cellularGeneration' in state.details) {
            const generation = (state.details as any).cellularGeneration;
            if (generation === '5g') {
              console.log('📡 5G detected, using highest quality (320kbps)');
              return '320';
            } else if (generation === '4g') {
              console.log('📡 4G detected, using high quality (256kbps)');
              return '256';
            } else if (generation === '3g') {
              console.log('📡 3G detected, using medium quality (192kbps)');
              return '192';
            } else {
              console.log('📡 2G/Unknown detected, using low quality (128kbps)');
              return '128';
            }
          }
      
          console.log('📡 Cellular (unknown generation) detected, using medium quality (192kbps)');
          return '192';
        
        case 'none':
          console.log('📡 No connection, using minimum quality (128kbps)');
          return '128';
        
        default:
          console.log('📡 Unknown network type, using high quality (256kbps)');
          return '256';
      }
    } catch (error) {
      console.error('Error checking network quality:', error);
    
      return '192';
    }
  }

  async getProgress(): Promise<ProgressInfo> {
    try {
      if (!this.currentSound) {
        return { position: 0, duration: 0 };
      }

      return new Promise((resolve) => {
        this.currentSound?.getCurrentTime((seconds) => {
          const duration = this.currentSound?.getDuration() || 0;
          resolve({ position: seconds, duration });
        });
      });
    } catch (error) {
      console.error('Error getting progress:', error);
      return { position: 0, duration: 0 };
    }
  }


  private getBestQualityDownloadUrl(
    downloadUrls: Array<{ quality: string; url: string }> | undefined,
    preferredQuality: NetworkQuality = '320'
  ): string {
    if (!downloadUrls || downloadUrls.length === 0) return '';

    const qualityOrder: Record<string, number> = {
      '320': 0,    
      '256': 1,
      '192': 2,
      '128': 3,    
    };

    
    const preferred = downloadUrls.find(d => d.quality === preferredQuality);
    if (preferred?.url) {
      console.log('🎶 Found preferred quality:', preferredQuality);
      return preferred.url;
    }

    
    const sorted = [...downloadUrls].sort((a, b) => {
      const aOrder = qualityOrder[a.quality] ?? 999;
      const bOrder = qualityOrder[b.quality] ?? 999;
      return aOrder - bOrder;
    });

    const bestUrl = sorted[0]?.url || '';
    console.log('🎶 Preferred quality not available. Selected quality:', sorted[0]?.quality, 'URL available:', !!bestUrl);
    return bestUrl;
  }
}

export default new AudioService();
