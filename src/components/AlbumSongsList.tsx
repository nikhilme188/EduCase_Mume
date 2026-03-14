import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AlbumSong } from '../hooks/useAlbumDetail';
import SongActionButtons from './SongActionButtons';

interface AlbumSongsListProps {
  songs: AlbumSong[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  theme: any;
  totalSongs: number;
  currentSongId?: string;
  isPlaying?: boolean;
  onSongPlay?: (song: AlbumSong) => void;
  onSongPause?: (song: AlbumSong) => void;
  onOptionPress?: (song: AlbumSong) => void;
  mainName?: string;
  isArtist?: boolean;
}

const AlbumSongsList: React.FC<AlbumSongsListProps> = ({
  songs,
  loading,
  hasMore,
  onLoadMore,
  theme,
  totalSongs,
  currentSongId,
  isPlaying = false,
  onSongPlay,
  onSongPause,
  onOptionPress,
  mainName,
  isArtist = false,
}) => {
  const renderSongItem = ({ item }: { item: AlbumSong }) => {
    const isCurrentSong = currentSongId === item.id;

    return (
      <View style={styles.songItemWrapper}>
        <Image
          source={{ uri: item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url }}
          style={styles.songThumbnail}
        />
        <View style={styles.songDetails}>
          <Text
            style={[styles.songName, { color: theme.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={[styles.songArtist, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {item.artists?.primary?.[0]?.name || 'Unknown'}
          </Text>
        </View>
        <SongActionButtons
          isCurrentSong={isCurrentSong}
          isPlaying={isCurrentSong && isPlaying}
          onPlayPress={() => onSongPlay?.(item)}
          onPausePress={() => onSongPause?.(item)}
          onMenuPress={() => onOptionPress?.(item)}
          theme={theme}
        />
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="small" color="#FF8216" />
        ) : (
          <Text style={[styles.loadMoreText, { color: theme.textSecondary }]}>
            Load more songs
          </Text>
        )}
      </View>
    );
  };

  if (totalSongs === 0 && !loading) {
    return (
      <Text style={[styles.noSongs, { color: theme.textSecondary }]}>
        {isArtist ? 'No songs of this artist' : 'No songs in this album'}
      </Text>
    );
  }

  return (
    <FlatList
      data={songs}
      renderItem={renderSongItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      scrollEnabled={false}
      onEndReached={() => {
        if (hasMore && !loading) {
          onLoadMore();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  songItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  songThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  songDetails: {
    flex: 1,
  },
  songName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 12,
  },
  noSongs: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AlbumSongsList;
