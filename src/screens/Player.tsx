import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootState, AppDispatch } from '../store/store';
import {
  togglePlayPauseAsync,
  playNext,
  playPrevious,
  setCurrentTime,
} from '../store/playerSlice';
import { useTheme } from '../hooks/useTheme';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { useProgressTracking } from '../hooks/usePlayerControls';
import SeekBar from '../components/SeekBar';
import audioService from '../services/audioService';

interface PlayerScreenProps {
  navigation: any;
}

const Player: React.FC<PlayerScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  
  // Redux selectors
  const { currentSong, isPlaying, currentTime, duration } = useSelector(
    (state: RootState) => state.player
  );

  // Custom hooks for separated concerns
  useAudioPlayback();
  useProgressTracking();

  if (!currentSong) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>No song playing</Text>
      </View>
    );
  }

  // Extract song info
  const imageUrl = currentSong.image?.[currentSong.image.length - 1]?.url || 
                   currentSong.image?.[0]?.url || '';
  const primaryArtist = currentSong.artists?.primary?.[0]?.name || 'Unknown Artist';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PlayerHeader navigation={navigation} theme={theme} />
      <AlbumArt imageUrl={imageUrl} />
      <SongInfo 
        song={currentSong} 
        primaryArtist={primaryArtist} 
        theme={theme} 
      />
      <SeekBar
        currentTime={currentTime}
        duration={duration}
        onSeek={async (value: number) => {
          dispatch(setCurrentTime(value));
          await audioService.seek(value);
        }}
        theme={theme}
      />
      <PlayerControls 
        isPlaying={isPlaying} 
        dispatch={dispatch} 
      />
    </View>
  );
};

// ============ Sub-Components ============

interface PlayerHeaderProps {
  navigation: any;
  theme: any;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ navigation, theme }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-down" size={28} color={theme.text} />
    </TouchableOpacity>
    <Text style={[styles.headerTitle, { color: theme.text }]}>
      Now Playing
    </Text>
    <View style={{ width: 28 }} />
  </View>
);

interface AlbumArtProps {
  imageUrl: string;
}

const AlbumArt: React.FC<AlbumArtProps> = ({ imageUrl }) => (
  <View style={styles.albumArtContainer}>
    {imageUrl && (
      <Image source={{ uri: imageUrl }} style={styles.albumArt} />
    )}
  </View>
);

interface SongInfoProps {
  song: any;
  primaryArtist: string;
  theme: any;
}

const SongInfo: React.FC<SongInfoProps> = ({ song, primaryArtist, theme }) => (
  <View style={styles.infoContainer}>
    <Text 
      style={[styles.songTitle, { color: theme.text }]} 
      numberOfLines={1}
    >
      {song.name}
    </Text>
    <Text 
      style={[styles.artistName, { color: '#888888' }]} 
      numberOfLines={1}
    >
      {primaryArtist}
    </Text>
    <Text 
      style={[styles.albumName, { color: '#888888' }]} 
      numberOfLines={1}
    >
      {song.album?.name || 'Unknown Album'}
    </Text>
  </View>
);

interface PlayerControlsProps {
  isPlaying: boolean;
  dispatch: AppDispatch;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ isPlaying, dispatch }) => (
  <View style={styles.controlsContainer}>
    <SkipButton direction="back" dispatch={dispatch} />
    <PlayPauseButton isPlaying={isPlaying} dispatch={dispatch} />
    <SkipButton direction="forward" dispatch={dispatch} />
  </View>
);

interface SkipButtonProps {
  direction: 'back' | 'forward';
  dispatch: AppDispatch;
}

const SkipButton: React.FC<SkipButtonProps> = ({ direction, dispatch }) => {
  const handlePress = async () => {
    if (direction === 'back') {
      dispatch(playPrevious());
      await audioService.skipToPrevious();
    } else {
      dispatch(playNext());
      await audioService.skipToNext();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.controlButton}>
      <Ionicons
        name={direction === 'back' ? 'play-skip-back' : 'play-skip-forward'}
        size={32}
        color="#FF8216"
      />
    </TouchableOpacity>
  );
};

interface PlayPauseButtonProps {
  isPlaying: boolean;
  dispatch: AppDispatch;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ isPlaying, dispatch }) => (
  <TouchableOpacity
    onPress={() => {
      console.log('Play button tapped. Current state:', isPlaying ? 'playing' : 'paused');
      dispatch(togglePlayPauseAsync());
    }}
    style={[styles.playPauseButton, { backgroundColor: '#FF8216' }]}
  >
    {isPlaying ? (
      <Ionicons name="pause" size={48} color="#ffffff" />
    ) : (
      <>
        <Text> </Text>
        <Ionicons name="play" size={48} color="#ffffff" />
      </>
    )}
  </TouchableOpacity>
);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  albumArtContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 16,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  albumName: {
    fontSize: 14,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  controlButton: {
    marginHorizontal: 20,
    padding: 12,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});

export default Player;
