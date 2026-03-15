import React, { useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { setCurrentSongWithTracking } from '../store/playerSlice';
import { Song } from '../types/song';
import SongOptionsModal from './SongOptionsModal';
import SongInfo from './SongInfo';
import SongActionButtons from './SongActionButtons';
import { useSongPlayback } from '../hooks/useSongPlayback';
import { useSongOptions } from '../hooks/useSongOptions';
import { getBestQualityImage } from '../utils/songImageUtils';

interface SongItemProps {
  song: Song;
  theme: any;
  songs: Song[];
  navigation: any;
}

const SongItem: React.FC<SongItemProps> = ({ song, theme, songs, navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Playback logic
  const { isCurrentSong, isPlaying, handlePlayButtonPress } = useSongPlayback(song, songs);
  
  // Options modal logic
  const { optionsModalVisible, openOptionsModal, closeOptionsModal, handleOptionSelect } = useSongOptions(() => {
    console.log(`Selected option for song: ${song.name}`);
    // Option handlers will be implemented here
  });

  // Close modal when navigating away from this screen
  useEffect(() => {
    const parentNavigation = navigation?.getParent?.();
    if (!parentNavigation) return;

    const unsubscribe = parentNavigation.addListener('blur', () => {
      closeOptionsModal();
    });

    return unsubscribe;
  }, [navigation, closeOptionsModal]);

  const imageUrl = getBestQualityImage(song);

  const handleSongPress = () => {
    dispatch(setCurrentSongWithTracking({ song, queue: songs }));
    navigation?.navigate('Player');
  };

  return (
    <>
      <View style={[styles.songCard, { backgroundColor: theme.background }]}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.songImage} />
        )}
        <TouchableOpacity
          style={styles.infoSection}
          onPress={handleSongPress}
        >
          <SongInfo song={song} theme={theme} />
        </TouchableOpacity>
        <SongActionButtons
          isCurrentSong={isCurrentSong}
          isPlaying={isPlaying}
          onPlayPress={handlePlayButtonPress}
          onMenuPress={openOptionsModal}
        />
      </View>

      <SongOptionsModal
        visible={optionsModalVisible}
        onClose={closeOptionsModal}
        song={song}
        theme={theme}
        onOptionSelect={handleOptionSelect}
      />
    </>
  );
};

const styles = StyleSheet.create({
  songCard: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  songImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
  },
  infoSection: {
    flex: 1,
  },
});

export default SongItem;
