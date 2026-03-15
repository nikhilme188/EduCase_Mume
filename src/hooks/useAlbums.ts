import { useState, useCallback } from 'react';
import { AlbumDetail } from '../types/album';
import { searchAlbums } from '../api/saavanApi';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const useAlbums = () => {
  const [albums, setAlbums] = useState<AlbumDetail[]>([]);
  const [currentAlphabetIndex, setCurrentAlphabetIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchAlbums = useCallback(async (alphabetIndex: number) => {
    if (alphabetIndex >= ALPHABET.length) {
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const query = ALPHABET[alphabetIndex];
      const response = await searchAlbums(query, 1, 10);

      if (response.success && response.data.results) {
        setAlbums((prevAlbums) => {
          // Deduplicate: only add albums that don't already exist by ID
          const existingIds = new Set(prevAlbums.map(a => a.id));
          const newAlbums = response.data.results.filter(
            (album: AlbumDetail) => !existingIds.has(album.id)
          );
          return [...prevAlbums, ...newAlbums];
        });
        setCurrentAlphabetIndex(alphabetIndex + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInitialAlbums = useCallback(() => {
    setAlbums([]);
    setCurrentAlphabetIndex(0);
    setHasMore(true);
    fetchAlbums(0);
  }, [fetchAlbums]);

  const loadMoreAlbums = useCallback(() => {
    if (!loading && hasMore) {
      fetchAlbums(currentAlphabetIndex);
    }
  }, [loading, hasMore, currentAlphabetIndex, fetchAlbums]);

  return {
    albums,
    loading,
    hasMore,
    loadInitialAlbums,
    loadMoreAlbums,
    currentAlphabet: ALPHABET[currentAlphabetIndex - 1] || 'A',
  };
};
