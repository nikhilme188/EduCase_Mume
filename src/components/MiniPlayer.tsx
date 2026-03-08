import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootState, AppDispatch } from '../store/store';
import { togglePlayPauseAsync } from '../store/playerSlice';
import { useTheme } from '../hooks/useTheme';

interface MiniPlayerProps {
  onPress: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { currentSong, isPlaying } = useSelector((state: RootState) => state.player);

  if (!currentSong) return null;

  const imageUrl =
    currentSong.image?.[0]?.url ||
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.miniPlayer, { backgroundColor: '#FF8216' }]}
      activeOpacity={0.8}
    >
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.songName} numberOfLines={1}>
          {currentSong.name}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {currentSong.artists?.primary?.[0]?.name || 'Unknown Artist'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => dispatch(togglePlayPauseAsync())}
        style={styles.playButton}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={24}
          color="#ffffff"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  songName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistName: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
  },
  playButton: {
    padding: 8,
  },
});

export default MiniPlayer;
