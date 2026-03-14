import React, { useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { useSongs } from '../../hooks/useSongs';
import { useSongSort, type SortType, type DecadeType } from '../../hooks/useSongSort';
import { Song } from '../../types/song';
import SongItem from '../../components/SongItem';
import SongsHeader from '../../components/SongsHeader';
import FilterPopup from '../../components/FilterModal';
import { openFilter, closeFilter } from '../../store/filterSlice';
import { RootState } from '../../store/store';

const Songs = () => {
  const navigation = useNavigation();
  const parentNavigation = (navigation as any)?.getParent?.();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { songs, loading, hasMore, loadInitialSongs, loadMoreSongs } =
    useSongs();
  const { sortBy, selectedDecade } = useSelector(
    (state: RootState) => state.filter
  );

  // Use custom sorting hook with decade parameter
  const { sortedSongs, getFilterLabel } = useSongSort(songs, sortBy, selectedDecade);

  // Limit to 10 songs when filtering by year, otherwise show all
  const displaySongs = useMemo(() => {
    if (sortBy === 'year' && selectedDecade) {
      return sortedSongs.slice(0, 10);
    }
    return sortedSongs;
  }, [sortedSongs, sortBy, selectedDecade]);

  useEffect(() => {
    loadInitialSongs();
  }, []);

  // Close filter popup when navigating away or screen loses focus
  useEffect(() => {
    const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', () => {
      dispatch(closeFilter());
    });

    const unsubscribeFocus = navigation.addListener('blur', () => {
      dispatch(closeFilter());
    });

    return () => {
      unsubscribeBeforeRemove();
      unsubscribeFocus();
    };
  }, [navigation, dispatch]);

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
          No songs found
        </Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FilterPopup theme={theme} />
      
      <View style={styles.headerContainer}>
        <SongsHeader
          songCount={displaySongs.length}
          totalSongs={sortBy === 'year' && selectedDecade ? sortedSongs.length : undefined}
          filterLabel={getFilterLabel()}
          theme={theme}
          onFilterPress={() => dispatch(openFilter())}
        />
      </View>

      {displaySongs.length > 0 ? (
        <FlatList
          data={displaySongs}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <SongItem
              song={item}
              theme={theme}
              songs={displaySongs}
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
      ) : renderEmptyState()}
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

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default Songs;
