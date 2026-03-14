import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../../hooks/useTheme';
import { useAlbums } from '../../../hooks/useAlbums';
import { useSortAlbums, AlbumSortType } from '../../../hooks/useSortAlbums';

import { AlbumDetail } from '../../../types/album';
import { albumService } from '../../../api/albumService';

import FilterPopup from '../../../components/FilterModal';
import SongsHeader from '../../../components/SongsHeader';

import { openFilter, closeFilter } from '../../../store/filterSlice';
import { RootState } from '../../../store/store';

import { styles } from './Album.styles';

const AlbumScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [songCountMap, setSongCountMap] = useState<Record<string, number>>({});

  const { albums, loading, hasMore, loadInitialAlbums, loadMoreAlbums } =
    useAlbums();

  const { sortBy } = useSelector((state: RootState) => state.filter);

  const { sortedAlbums, getFilterLabel } = useSortAlbums(
    albums,
    (sortBy === 'ascending' || sortBy === 'descending' || sortBy === 'dateAdded'
      ? sortBy
      : 'ascending') as AlbumSortType
  );

  useEffect(() => {
    loadInitialAlbums();
  }, []);

  // Fetch song counts for albums
  useEffect(() => {
    albums.forEach((album) => {
      fetchSongCount(album.id);
    });
  }, [albums]);

  // Close filter popup when leaving screen
  useEffect(() => {
    const unsubscribeBeforeRemove = navigation.addListener(
      'beforeRemove',
      () => {
        dispatch(closeFilter());
      }
    );

    const unsubscribeBlur = navigation.addListener('blur', () => {
      dispatch(closeFilter());
    });

    return () => {
      unsubscribeBeforeRemove();
      unsubscribeBlur();
    };
  }, [navigation]);

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#FF8216" />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF8216" />
      ) : (
        <Text style={[styles.emptyText, { color: theme.text }]}>
          No albums found
        </Text>
      )}
    </View>
  );

  const fetchSongCount = async (albumId: string) => {
    if (songCountMap[albumId] !== undefined) {
      return;
    }
    try {
      const response = await albumService.getAlbumSongs(albumId);
      if (response.success && response.data.songs) {
        setSongCountMap((prev) => ({
          ...prev,
          [albumId]: response.data.songs.length,
        }));
      }
    } catch (error) {
      console.error('Error fetching song count:', error);
    }
  };

  const renderAlbumItem = ({ item }: { item: AlbumDetail }) => {
    const count = songCountMap[item.id] ?? 0;

    return (
      <TouchableOpacity
        style={styles.albumItem}
        onPress={() => {
          (navigation as any).navigate('AlbumDetail', { album: item });
        }}
      >
        <Image
          source={{ uri: item.image?.[2]?.url }}
          style={styles.albumImage}
        />

        <View style={styles.albumDetails}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={[styles.albumTitle, { color: theme.text, flex: 1 }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <TouchableOpacity style={{ padding: 4 }}>
              <Ionicons name="ellipsis-vertical" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 2 }}>
            <Text style={styles.albumMeta} numberOfLines={1}>
              {(item.artists?.primary?.[0]?.name || item.artists?.all?.[0]?.name || 'Unknown').substring(0, 15)}  |  {item.year}
            </Text>
            <Text style={styles.albumMeta} numberOfLines={1}>
              {count} {count === 1 ? 'song' : 'songs'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FilterPopup theme={theme} filterType="albums" />

      <View style={styles.headerContainer}>
        <SongsHeader
          songCount={sortedAlbums.length}
          filterLabel={getFilterLabel()}
          theme={theme}
          onFilterPress={() => dispatch(openFilter())}
          itemLabel="albums"
        />
      </View>

      <FlatList
        data={sortedAlbums}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        renderItem={renderAlbumItem}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}

        onEndReached={() => {
          if (hasMore && !loading) {
            loadMoreAlbums();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

export default AlbumScreen;