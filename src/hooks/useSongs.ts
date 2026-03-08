import { useState, useCallback } from 'react';
import { Song } from '../types/song';
import { searchSongs } from '../api/saavanApi';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const useSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentAlphabetIndex, setCurrentAlphabetIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchSongs = useCallback(async (alphabetIndex: number) => {
    if (alphabetIndex >= ALPHABET.length) {
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const query = ALPHABET[alphabetIndex];
      const response = await searchSongs(query, 1, 15);

      if (response.success && response.data.results) {
        setSongs((prevSongs) => [...prevSongs, ...response.data.results]);
        setCurrentAlphabetIndex(alphabetIndex + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInitialSongs = useCallback(() => {
    setSongs([]);
    setCurrentAlphabetIndex(0);
    setHasMore(true);
    fetchSongs(0);
  }, [fetchSongs]);

  const loadMoreSongs = useCallback(() => {
    if (!loading && hasMore) {
      fetchSongs(currentAlphabetIndex);
    }
  }, [loading, hasMore, currentAlphabetIndex, fetchSongs]);

  return {
    songs,
    loading,
    hasMore,
    loadInitialSongs,
    loadMoreSongs,
    currentAlphabet: ALPHABET[currentAlphabetIndex - 1] || 'A',
  };
};
