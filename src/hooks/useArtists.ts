import { useState, useCallback } from 'react';
import { Artist } from '../types/artist';
import { searchArtists } from '../api/artistService';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const useArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [currentAlphabetIndex, setCurrentAlphabetIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchArtists = useCallback(async (alphabetIndex: number) => {
    if (alphabetIndex >= ALPHABET.length) {
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const query = ALPHABET[alphabetIndex];
      const response = await searchArtists(query, 1, 10);

      if (response.success && response.data.results) {
        setArtists((prevArtists) => [...prevArtists, ...response.data.results]);
        setCurrentAlphabetIndex(alphabetIndex + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInitialArtists = useCallback(() => {
    setArtists([]);
    setCurrentAlphabetIndex(0);
    setHasMore(true);
    fetchArtists(0);
  }, [fetchArtists]);

  const loadMoreArtists = useCallback(() => {
    if (!loading && hasMore) {
      fetchArtists(currentAlphabetIndex);
    }
  }, [loading, hasMore, currentAlphabetIndex, fetchArtists]);

  return {
    artists,
    loading,
    hasMore,
    loadInitialArtists,
    loadMoreArtists,
    currentAlphabet: ALPHABET[currentAlphabetIndex - 1] || 'A',
  };
};
