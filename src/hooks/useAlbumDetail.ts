import { useEffect, useState, useCallback } from 'react';
import { albumService } from '../api/albumService';

export interface AlbumSong {
  id: string;
  name: string;
  duration: number;
  artists?: {
    primary: Array<{
      id: string;
      name: string;
      role: string;
      type: string;
      image: Array<{
        quality: string;
        url: string;
      }>;
      url: string;
    }>;
    featured?: Array<{
      id: string;
      name: string;
    }>;
    all: Array<{
      id: string;
      name: string;
    }>;
  };
  image?: Array<{
    quality: string;
    url: string;
  }>;
}

const INITIAL_LOAD_COUNT = 10;
const PAGINATION_LOAD_COUNT = 5;

interface UseAlbumDetailReturn {
  songs: AlbumSong[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  totalSongs: number;
}

export const useAlbumDetail = (albumId?: string, isArtist: boolean = false): UseAlbumDetailReturn => {
  const [songs, setSongs] = useState<AlbumSong[]>([]);
  const [allSongs, setAllSongs] = useState<AlbumSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD_COUNT);

  const fetchAlbumSongs = useCallback(async () => {
    if (!albumId) return;

    setLoading(true);
    setError(null);

    try {
      const response = isArtist 
        ? await albumService.getArtistSongs(albumId)
        : await albumService.getAlbumSongs(albumId);

      console.log(`Fetching ${isArtist ? 'artist' : 'album'} songs for ID: ${albumId}`);
      console.log('Response:', response);

      if (response.success && response.data?.songs) {
        console.log(`Got ${response.data.songs.length} songs`);
        setAllSongs(response.data.songs);
        setSongs(response.data.songs.slice(0, INITIAL_LOAD_COUNT));
        setDisplayCount(INITIAL_LOAD_COUNT);
      } else {
        console.log('Response structure invalid or no songs found');
        setError(`Failed to fetch ${isArtist ? 'artist' : 'album'} songs`);
      }
    } catch (err) {
      setError(`Error loading ${isArtist ? 'artist' : 'album'} songs`);
      console.error('Detail error:', err);
    } finally {
      setLoading(false);
    }
  }, [albumId, isArtist]);

  useEffect(() => {
    fetchAlbumSongs();
  }, [fetchAlbumSongs]);

  const loadMore = useCallback(() => {
    const newCount = Math.min(displayCount + PAGINATION_LOAD_COUNT, allSongs.length);
    setDisplayCount(newCount);
    setSongs(allSongs.slice(0, newCount));
  }, [displayCount, allSongs]);

  return {
    songs,
    loading,
    error,
    hasMore: displayCount < allSongs.length,
    loadMore,
    totalSongs: allSongs.length,
  };
};
