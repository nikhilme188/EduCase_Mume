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
import { useProgressTracking } from '../hooks/usePlayerControls';
import SeekBar from '../components/SeekBar';
import SongActionButtons from '../components/SongActionButtons';
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
        theme={theme}
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
  theme: any;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ isPlaying, dispatch, theme }) => {
  const handleSkip = async (direction: 'back' | 'forward') => {
    if (direction === 'back') {
      dispatch(playPrevious());
      await audioService.skipToPrevious();
    } else {
      dispatch(playNext());
      await audioService.skipToNext();
    }
  };

  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity onPress={() => handleSkip('back')} style={styles.controlButton}>
        <Ionicons name="play-skip-back" size={32} color="#FF8216" />
      </TouchableOpacity>

      <SongActionButtons
        isCurrentSong={true}
        isPlaying={isPlaying}
        onPlayPress={() => dispatch(togglePlayPauseAsync())}
        onPausePress={() => dispatch(togglePlayPauseAsync())}
        theme={theme}
        showMenu={false}
        buttonSize={100}
      />

      <TouchableOpacity onPress={() => handleSkip('forward')} style={styles.controlButton}>
        <Ionicons name="play-skip-forward" size={32} color="#FF8216" />
      </TouchableOpacity>
    </View>
  );
};



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
    gap: 20,
  },
  controlButton: {
    padding: 12,
  },
});

export default Player;
