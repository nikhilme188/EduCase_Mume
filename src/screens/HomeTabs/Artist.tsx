import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { useArtists } from '../../hooks/useArtists';
import { useSortArtists, ArtistSortType } from '../../hooks/useSortArtists';
import { Artist } from '../../types/artist';
import FilterPopup from '../../components/FilterModal';
import SongsHeader from '../../components/SongsHeader';
import ArtistItemWithStats from '../../components/ArtistItemWithStats';
import ArtistOptionsModal from '../../components/ArtistOptionsModal';
import { openFilter, closeFilter } from '../../store/filterSlice';
import { RootState } from '../../store/store';

const ArtistScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStats, setModalStats] = useState<{ albumCount: number; songCount: number }>({
    albumCount: 0,
    songCount: 0,
  });

  const { artists, loading, hasMore, loadInitialArtists, loadMoreArtists } =
    useArtists();

  const { sortBy } = useSelector((state: RootState) => state.filter);

  const { sortedArtists, getFilterLabel } = useSortArtists(
    artists,
    (sortBy === 'ascending' || sortBy === 'descending'
      ? sortBy
      : 'ascending') as ArtistSortType
  );

  useEffect(() => {
    loadInitialArtists();
  }, []);

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
          No artists found
        </Text>
      )}
    </View>
  );

  const renderArtistItem = ({ item }: { item: Artist }) => (
    <ArtistItemWithStats
      artist={item}
      onPress={() => {
        (navigation as any).navigate('AlbumDetail', { artist: item, isArtist: true });
      }}
      onMenuPress={(stats) => {
        setSelectedArtist(item);
        setModalStats({
          albumCount: stats?.totalAlbums || 0,
          songCount: stats?.totalSongs || 0,
        });
        setIsModalVisible(true);
      }}
      theme={theme}
    />
  );

  const handleOptionSelect = (option: string) => {
    console.log(`Selected option: ${option} for artist:`, selectedArtist?.name);
    // TODO: Implement option handling
    // - play: Play all songs from this artist
    // - playNext: Add to queue
    // - queue: Add to playing queue
    // - playlist: Add to playlist
    // - share: Share artist
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FilterPopup theme={theme} filterType="artists" />

      <View style={styles.headerContainer}>
        <SongsHeader
          songCount={sortedArtists.length}
          filterLabel={getFilterLabel()}
          theme={theme}
          onFilterPress={() => dispatch(openFilter())}
          itemLabel="artists"
        />
      </View>

      <FlatList
        data={sortedArtists}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderArtistItem}
        contentContainerStyle={styles.list}
        onEndReached={() => {
          if (hasMore && !loading) {
            loadMoreArtists();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
      />

      <ArtistOptionsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        artist={selectedArtist}
        albumCount={modalStats.albumCount}
        songCount={modalStats.songCount}
        theme={theme}
        onOptionSelect={handleOptionSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    zIndex: 100,
    paddingHorizontal: 16,
  },
  list: {
    paddingVertical: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default ArtistScreen;
