import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SongActionButtonsProps {
  isCurrentSong: boolean;
  isPlaying: boolean;
  onPlayPress: () => void;
  onPausePress?: () => void;
  onMenuPress: () => void;
  theme?: any;
}

/**
 * Component responsible for rendering action buttons (play/pause and options menu).
 * Separated from song info for cleaner separation of concerns.
 */
const SongActionButtons: React.FC<SongActionButtonsProps> = ({
  isCurrentSong,
  isPlaying,
  onPlayPress,
  onPausePress,
  onMenuPress,
  theme,
}) => {
  const menuColor = theme?.text || '#000000';

  const handlePlayPausePress = () => {
    if (isCurrentSong && isPlaying && onPausePress) {
      onPausePress();
    } else {
      onPlayPress();
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handlePlayPausePress} style={styles.playButton}>
        <Ionicons
          name={isCurrentSong && isPlaying ? 'pause-circle' : 'play-circle'}
          size={40}
          color="#FF8216"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={menuColor} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  playButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
});

export default SongActionButtons;
