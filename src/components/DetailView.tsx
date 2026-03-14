import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import { useAlbumDetail } from '../hooks/useAlbumDetail';
import { useArtistStats } from '../hooks/useArtistStats';
import AlbumSongsList from './AlbumSongsList';
import { AlbumDetail as AlbumDetailType } from '../types/album';
import { Artist } from '../types/artist';
import { setCurrentSong, togglePlayPause, pauseAsync } from '../store/playerSlice';
import { RootState, AppDispatch } from '../store/store';

const DetailView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  
  const album = (route.params as any)?.album as AlbumDetailType | undefined;
  const artist = (route.params as any)?.artist as Artist | undefined;
  const isArtist = (route.params as any)?.isArtist === true;
  
  const id = isArtist ? artist?.id : album?.id;
  const { songs, loading, hasMore, loadMore, totalSongs } = useAlbumDetail(id, isArtist);
  
  useEffect(() => {
    console.log('DetailView - isArtist:', isArtist);
    console.log('DetailView - id:', id);
    console.log('DetailView - songs:', songs);
    console.log('DetailView - loading:', loading);
  }, [isArtist, id, songs, loading]);
  
  const { currentSong, isPlaying } = useSelector((state: RootState) => state.player);
  
  // Fetch artist stats only if viewing an artist
  const { stats: artistStats, loading: statsLoading } = useArtistStats(isArtist ? artist?.id : undefined);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSongPlay = (song: any) => {
    if (currentSong?.id === song.id) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setCurrentSong({ song: song as any, queue: songs as any }));
    }
  };

  const handleSongPause = (song: any) => {
    if (currentSong?.id === song.id) {
      dispatch(pauseAsync());
    }
  };

  const handleOptionPress = (song: any) => {
    // TODO: Implement options modal for album songs
    console.log('Options pressed for song:', song.name);
  };

  const calculateTotalDuration = (songs: any[]) => {
    return songs.reduce((total, song) => total + (song.duration || 0), 0);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')} mins`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')} mins`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: isArtist 
            ? artist?.image?.[2]?.url || artist?.image?.[1]?.url
            : album?.image?.[2]?.url 
          }}
          style={[styles.albumImage, { borderRadius: isArtist ? 125 : 12 }]}
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.albumTitle, { color: theme.text }]}>
          {isArtist ? artist?.name : album?.name}
        </Text>
        <Text style={[styles.albumStats, { color: theme.textSecondary }]}>
          {isArtist 
            ? statsLoading 
              ? 'Loading...'
              : `${artistStats?.totalAlbums || 0} Albums | ${artistStats?.totalSongs || 0} Songs`
            : `1 Album | ${totalSongs} Songs | ${formatDuration(calculateTotalDuration(songs))}`
          }
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.shuffleButton, { borderColor: '#FF8216' }]}
        >
          <Ionicons name="shuffle" size={20} color="#FF8216" />
          <Text style={styles.shuffleButtonText}>Shuffle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: '#FF8216' }]}
        >
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </View>

      {/* Songs List */}
      <View style={styles.songsContainer}>
        <View style={styles.songsHeader}>
          <Text style={[styles.songsTitle, { color: theme.text }]}>
            Songs
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: '#FF8216' }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <AlbumSongsList
          songs={songs}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          theme={theme}
          totalSongs={totalSongs}
          currentSongId={currentSong?.id}
          isPlaying={isPlaying}
          onSongPlay={handleSongPlay}
          onSongPause={handleSongPause}
          onOptionPress={handleOptionPress}
          mainName={isArtist ? artist?.name : album?.name}
          isArtist={isArtist}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  albumImage: {
    width: 250,
    height: 250,
  },
  infoContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  albumStats: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  shuffleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  shuffleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8216',
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  songsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  songsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  songsTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DetailView;
