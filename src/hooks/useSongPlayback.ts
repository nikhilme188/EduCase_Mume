import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setCurrentSong, togglePlayPauseAsync } from '../store/playerSlice';
import { Song } from '../types/song';

interface UseSongPlaybackReturn {
  isCurrentSong: boolean;
  isPlaying: boolean;
  handlePlayButtonPress: () => void;
}

/**
 * Custom hook for managing song playback logic.
 * Handles determining if a song is currently playing and toggling playback.
 */
export const useSongPlayback = (song: Song, queue: Song[]): UseSongPlaybackReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  const isCurrentSong = currentSong?.id === song.id;

  const handlePlayButtonPress = () => {
    if (isCurrentSong) {
      // Toggle play/pause if this is the current song
      dispatch(togglePlayPauseAsync());
    } else {
      // Set as current song and play
      dispatch(setCurrentSong({ song, queue }));
    }
  };

  return {
    isCurrentSong,
    isPlaying: isCurrentSong && isPlaying,
    handlePlayButtonPress,
  };
};
