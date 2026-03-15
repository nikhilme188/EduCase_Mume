import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useSuggestedArtists, useRecentlyPlayed, useMostPlayed } from '../../hooks/useSuggestedArtists';
import ArtistsSection from '../../components/Sections/ArtistsSection';
import RecentlyPlayedSection from '../../components/Sections/RecentlyPlayedSection';
import MostPlayedSection from '../../components/Sections/MostPlayedSection';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { mostPlayedService } from '../../api/mostPlayedService';
import { recentlyPlayedService } from '../../api/recentlyPlayedService';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSongWithTracking } from '../../store/playerSlice';
import { AppDispatch, RootState } from '../../store/store';
import { getSongById } from '../../api/saavanApi';

const Suggested = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong } = useSelector((state: RootState) => state.player);
  const { artists, loading: artistsLoading, hasMore, loadMore } = useSuggestedArtists();
  const { songs: recentSongs, loading: recentLoading } = useRecentlyPlayed();
  const { songs, loading: songsLoading } = useMostPlayed();
  const [refreshedSongs, setRefreshedSongs] = useState(recentSongs);
  const [refreshedMostPlayedSongs, setRefreshedMostPlayedSongs] = useState(songs);

  // Refresh most played songs when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const refreshMostPlayed = async () => {
        const mostPlayedSongs = await mostPlayedService.getMostPlayed();
        const allSongs = await mostPlayedService.getAllSongsDebug();
        setRefreshedMostPlayedSongs(mostPlayedSongs);
        console.log('[Suggested] Refreshed most played songs (filtered):', mostPlayedSongs.length);
        console.log('[Suggested] All songs in storage:', allSongs.map(s => ({name: s.name, playCount: s.playCount})));
        console.log('[Suggested] Songs with playCount > 3:', mostPlayedSongs.map(s => ({name: s.name, playCount: s.playCount})));
      };
      refreshMostPlayed();
    }, [])
  );

  // Auto-refresh most played songs whenever a song is played
  useEffect(() => {
    const refreshMostPlayed = async () => {
      const mostPlayedSongs = await mostPlayedService.getMostPlayed();
      setRefreshedMostPlayedSongs(mostPlayedSongs);
      console.log('[Suggested] Auto-refreshed most played songs:', mostPlayedSongs.length);
    };
    
    if (currentSong?.id) {
      refreshMostPlayed();
    }
  }, [currentSong?.id]);

  // Auto-refresh recently played songs whenever a song is played
  useEffect(() => {
    const refreshRecentlyPlayed = async () => {
      const recentlyPlayedSongs = await recentlyPlayedService.getRecentlyPlayed();
      setRefreshedSongs(recentlyPlayedSongs);
      console.log('[Suggested] Auto-refreshed recently played songs:', recentlyPlayedSongs.length);
    };
    
    if (currentSong?.id) {
      refreshRecentlyPlayed();
    }
  }, [currentSong?.id]);

  // Auto-refresh artists section when a song is played (consistent with other sections)
  useEffect(() => {
    if (currentSong?.id) {
      console.log('[Suggested] Auto-refresh trigger for artists section');
    }
  }, [currentSong?.id]);

  // Also update when recentSongs changes
  useEffect(() => {
    setRefreshedSongs(recentSongs);
  }, [recentSongs]);

  // Also update when most played songs change
  useEffect(() => {
    setRefreshedMostPlayedSongs(songs);
  }, [songs]);

  const handleArtistPress = (artist: any) => {
    console.log('[Suggested] Artist pressed:', artist.name, artist.id);
    navigation.navigate('AlbumDetail', {
      artist: artist,
      isArtist: true,
    });
  };

  const handleRecentSongPress = async (song: any) => {
    console.log('[Suggested] Recently played song pressed:', song.name, song.id);
    try {
      // Fetch full song data with downloadUrl
      console.log('[Suggested] Fetching full song data for:', song.id);
      const fullSongResponse = await getSongById(song.id);
      
      // Extract song from array
      const fullSong = fullSongResponse.data && Array.isArray(fullSongResponse.data) 
        ? fullSongResponse.data[0] 
        : fullSongResponse.data;
      
      console.log('[Suggested] Full song data received:', { id: fullSong.id, name: fullSong.name, hasDownloadUrl: !!fullSong.downloadUrl });
      
      // Play the song with full data
      await dispatch(setCurrentSongWithTracking({ song: fullSong, queue: refreshedSongs as any }));
      navigation.navigate('Player');
    } catch (error) {
      console.error('[Suggested] Error fetching song:', error);
      // Fallback: play with partial data
      await dispatch(setCurrentSongWithTracking({ song, queue: refreshedSongs as any }));
      navigation.navigate('Player');
    }
  };

  const handleSongPress = async (song: any) => {
    console.log('[Suggested] Song pressed:', song.name, song.id);
    try {
      // Fetch full song data with downloadUrl
      console.log('[Suggested] Fetching full song data for:', song.id);
      const fullSongResponse = await getSongById(song.id);
      
      // Extract song from array
      const fullSong = fullSongResponse.data && Array.isArray(fullSongResponse.data) 
        ? fullSongResponse.data[0] 
        : fullSongResponse.data;
      
      console.log('[Suggested] Full song data received:', { id: fullSong.id, name: fullSong.name, hasDownloadUrl: !!fullSong.downloadUrl });
      
      // Play the song with full data
      await dispatch(setCurrentSongWithTracking({ song: fullSong, queue: refreshedMostPlayedSongs as any }));
      navigation.navigate('Player');
    } catch (error) {
      console.error('[Suggested] Error fetching song:', error);
      // Fallback: play with partial data
      await dispatch(setCurrentSongWithTracking({ song, queue: refreshedMostPlayedSongs as any }));
      navigation.navigate('Player');
    }
  };

  const handleSeeAllRecentSongs = () => {
    console.log('[Suggested] See all recently played songs clicked');
  };

  const handleSeeAllArtists = () => {
    console.log('[Suggested] See all artists clicked');
    navigation.navigate('Artists');
  };

  const handleSeeAllSongs = () => {
    console.log('[Suggested] See all songs clicked');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Recently Played Section */}
        {refreshedSongs.length > 0 && (
          <RecentlyPlayedSection
            songs={refreshedSongs}
            loading={recentLoading}
            theme={theme}
            onSongPress={handleRecentSongPress}
            onSeeAll={handleSeeAllRecentSongs}
          />
        )}

        {/* Artists Section */}
        <ArtistsSection
          artists={artists}
          loading={artistsLoading}
          theme={theme}
          onArtistPress={handleArtistPress}
          onSeeAll={handleSeeAllArtists}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />

        {/* Most Played Section */}
        {refreshedMostPlayedSongs.length > 0 && (
          <MostPlayedSection
            songs={refreshedMostPlayedSongs}
            loading={songsLoading}
            theme={theme}
            onSongPress={handleSongPress}
            onSeeAll={handleSeeAllSongs}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

export default Suggested;

