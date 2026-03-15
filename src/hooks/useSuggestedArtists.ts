import { useEffect, useState, useCallback } from 'react';
import { suggestedService } from '../api/suggestedService';
import { recentlyPlayedService, PlayedSong } from '../api/recentlyPlayedService';
import { mostPlayedService, MostPlayedSong } from '../api/mostPlayedService';

export interface SuggestedArtist {
  id: string;
  name: string;
  image: Array<{
    quality: string;
    url: string;
  }>;
  url: string;
  type: string;
}

interface UseSuggestedArtistsReturn {
  artists: SuggestedArtist[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

const INITIAL_LOAD_COUNT = 10;
const PAGINATION_LOAD_COUNT = 5;

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useSuggestedArtists = (): UseSuggestedArtistsReturn => {
  const [artists, setArtists] = useState<SuggestedArtist[]>([]);
  const [allArtists, setAllArtists] = useState<SuggestedArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD_COUNT);

  const fetchSuggestedArtists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await suggestedService.getRandomArtists(20);

      console.log('[useSuggestedArtists] Fetching random artists');
      console.log('[useSuggestedArtists] Full Response:', response);

      if (response && response.data && Array.isArray(response.data.artists)) {
        const artistsData = response.data.artists;
        console.log(`[useSuggestedArtists] Got ${artistsData.length} artists`);

        if (artistsData.length > 0) {
          // Shuffle the artists array for variety
          const shuffledArtists = shuffleArray(artistsData);
          setAllArtists(shuffledArtists);
          setArtists(shuffledArtists.slice(0, INITIAL_LOAD_COUNT));
          setDisplayCount(INITIAL_LOAD_COUNT);
        } else {
          setError('No artists found');
        }
      } else {
        setError('Failed to fetch suggested artists');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error loading suggested artists');
      console.error('[useSuggestedArtists] Error:', errorMessage, err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    const newDisplayCount = displayCount + PAGINATION_LOAD_COUNT;
    setDisplayCount(newDisplayCount);
    setArtists(allArtists.slice(0, newDisplayCount));

    if (newDisplayCount >= allArtists.length) {
      console.log('[useSuggestedArtists] Reached end of artists list');
    }
  }, [displayCount, allArtists]);

  useEffect(() => {
    fetchSuggestedArtists();
  }, [fetchSuggestedArtists]);

  return {
    artists,
    loading,
    error,
    hasMore: displayCount < allArtists.length,
    loadMore,
  };
};

// Hook for recently played songs (from AsyncStorage)
export const useRecentlyPlayed = () => {
  const [songs, setSongs] = useState<PlayedSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      setLoading(true);
      try {
        const recentSongs = await recentlyPlayedService.getRecentlyPlayed();
        setSongs(recentSongs);
        console.log('[useRecentlyPlayed] Loaded', recentSongs.length, 'recently played songs');
      } catch (error) {
        console.error('Error fetching recently played songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, []);

  // Function to add a song to recently played
  const addSong = useCallback(async (song: Omit<PlayedSong, 'playedAt'>) => {
    await recentlyPlayedService.addRecentlyPlayed(song);
    // Reload the list
    const updatedSongs = await recentlyPlayedService.getRecentlyPlayed();
    setSongs(updatedSongs);
  }, []);

  return { songs, loading, addSong };
};

// Hook for most played songs
export const useMostPlayed = () => {
  const [songs, setSongs] = useState<MostPlayedSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostPlayed = async () => {
      setLoading(true);
      try {
        const mostPlayedSongs = await mostPlayedService.getMostPlayed();
        setSongs(mostPlayedSongs);
        console.log('[useMostPlayed] Loaded', mostPlayedSongs.length, 'most played songs');
      } catch (error) {
        console.error('Error fetching most played:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostPlayed();
  }, []);

  // Function to increment play count for a song
  const addPlayCount = useCallback(async (song: Omit<MostPlayedSong, 'playCount' | 'lastPlayedAt'>) => {
    await mostPlayedService.addPlayCount(song);
    // Reload the list
    const updatedSongs = await mostPlayedService.getMostPlayed();
    setSongs(updatedSongs);
  }, []);

  return { songs, loading, addPlayCount };
};
