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

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAlbumSongs = useCallback(async () => {
    if (!albumId) return;

    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (isArtist) {
        // For artists, fetch only the first page initially
        response = await albumService.getArtistSongsPage(albumId, 1);
        setCurrentPage(1);
      } else {
        // For albums, fetch all songs at once
        response = await albumService.getAlbumSongs(albumId);
      }

      console.log(`[useAlbumDetail] Fetching ${isArtist ? 'artist' : 'album'} songs for ID: ${albumId}`);
      console.log('[useAlbumDetail] Full Response:', response);

      // Validate response has songs
      if (response && response.data && Array.isArray(response.data.songs)) {
        const songsData = response.data.songs;
        console.log(`[useAlbumDetail] Got ${songsData.length} songs`);
        
        if (songsData.length > 0) {
          // Shuffle the songs array
          const shuffledSongs = shuffleArray(songsData);
          setAllSongs(shuffledSongs);
          setSongs(shuffledSongs.slice(0, INITIAL_LOAD_COUNT));
          setDisplayCount(INITIAL_LOAD_COUNT);
          
          // Calculate total pages if this is artist view
          if (isArtist && response.data.total) {
            const pages = Math.ceil(response.data.total / 50);
            setTotalPages(pages);
          }
        } else {
          setError(`No ${isArtist ? 'artist' : 'album'} songs found`);
        }
      } else {
        console.log('[useAlbumDetail] Invalid response structure:', { success: response?.success, hasData: !!response?.data, hasSongs: !!response?.data?.songs });
        setError(`Failed to fetch ${isArtist ? 'artist' : 'album'} songs`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error loading ${isArtist ? 'artist' : 'album'} songs`);
      console.error('[useAlbumDetail] Detail error:', errorMessage, err);
    } finally {
      setLoading(false);
    }
  }, [albumId, isArtist]);

  useEffect(() => {
    fetchAlbumSongs();
  }, [fetchAlbumSongs]);

  const loadMore = useCallback(async () => {
    // If we already have enough songs loaded, just show more from cache
    if (displayCount + PAGINATION_LOAD_COUNT <= allSongs.length) {
      const newCount = Math.min(displayCount + PAGINATION_LOAD_COUNT, allSongs.length);
      setDisplayCount(newCount);
      setSongs(allSongs.slice(0, newCount));
    } else if (isArtist) {
      // For artists, fetch the next page
      const nextPage = currentPage + 1;
      if (nextPage <= totalPages) {
        const pageResponse = await albumService.getArtistSongsPage(albumId!, nextPage);
        
        if (pageResponse.success && pageResponse.data?.songs) {
          const newSongs = [...allSongs, ...pageResponse.data.songs];
          setAllSongs(newSongs);
          
          const newCount = Math.min(displayCount + PAGINATION_LOAD_COUNT, newSongs.length);
          setDisplayCount(newCount);
          setSongs(newSongs.slice(0, newCount));
          setCurrentPage(nextPage);
        }
      }
    }
  }, [displayCount, allSongs, isArtist, currentPage, totalPages, albumId]);

  return {
    songs,
    loading,
    error,
    hasMore: isArtist ? currentPage < totalPages : displayCount < allSongs.length,
    loadMore,
    totalSongs: allSongs.length,
  };
};
