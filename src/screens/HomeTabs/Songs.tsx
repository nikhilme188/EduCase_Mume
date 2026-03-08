import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useSongs } from '../../hooks/useSongs';
import { Song } from '../../types/song';
import MiniPlayer from '../../components/MiniPlayer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSong, togglePlayPauseAsync } from '../../store/playerSlice';
import { RootState, AppDispatch } from '../../store/store';

const SongItem = ({ 
  song, 
  theme, 
  songs,
  onPlayPress,
  navigation,
}: { 
  song: Song; 
  theme: any;
  songs: Song[];
  onPlayPress: () => void;
  navigation: any;
}) => {
  const primaryArtist = song.artists?.primary?.[0]?.name || 'Unknown Artist';
  
  // Get the best quality image
  const getBestQualityImage = () => {
    if (!song.image || song.image.length === 0) return '';
    
    const qualityOrder = { high: 0, medium: 1, low: 2, '150x150': 3, '500x500': 0 };
    const sortedImages = [...song.image].sort((a, b) => {
      const aOrder = qualityOrder[a.quality as keyof typeof qualityOrder] ?? 999;
      const bOrder = qualityOrder[b.quality as keyof typeof qualityOrder] ?? 999;
      return aOrder - bOrder;
    });
    return sortedImages[0]?.url || '';
  };

  const imageUrl = getBestQualityImage();
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );
  const isCurrentSong = currentSong?.id === song.id;

  return (
    <View style={[styles.songCard, { backgroundColor: theme.background }]}>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.songImage}
        />
      )}
      <TouchableOpacity
        style={styles.songInfo}
        onPress={() => {
          // Set current song and navigate to player
          dispatch(setCurrentSong({ song, queue: songs }));
          navigation?.navigate('Player');
        }}
      >
        <Text style={[styles.songTitle, { color: theme.text }]} numberOfLines={1}>
          {song.name}
        </Text>
        <Text style={[styles.artistName, { color: '#888888' }]} numberOfLines={1}>
          {primaryArtist}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (isCurrentSong) {
            dispatch(togglePlayPauseAsync());
          } else {
            dispatch(setCurrentSong({ song, queue: songs }));
          }
        }}
        style={styles.playButton}
      >
        <Ionicons
          name={isCurrentSong && isPlaying ? 'pause-circle' : 'play-circle'}
          size={40}
          color="#FF8216"
        />
      </TouchableOpacity>
    </View>
  );
};

const Songs = () => {
  const navigation = useNavigation();
  const parentNavigation = (navigation as any)?.getParent?.();
  const theme = useTheme();
  const { songs, loading, hasMore, loadInitialSongs, loadMoreSongs } =
    useSongs();

  useEffect(() => {
    loadInitialSongs();
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#FF8216" />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {songs.length > 0 ? (
        <>
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SongItem
                song={item}
                theme={theme}
                songs={songs}
                onPlayPress={() => {
                  // Navigate to player when long pressed
                }}
                navigation={parentNavigation}
              />
            )}
            onEndReached={() => {
              if (hasMore && !loading) {
                loadMoreSongs();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            scrollIndicatorInsets={{ right: 1 }}
          />
          <MiniPlayer
            onPress={() => parentNavigation?.navigate('Player')}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#FF8216" />
          ) : (
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No songs found
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
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
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 12,
  },
  playButton: {
    padding: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default Songs;
