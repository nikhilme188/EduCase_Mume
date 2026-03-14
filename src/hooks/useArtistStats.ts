/**
 * useArtistStats Hook
 * Manages fetching and caching artist statistics (album and song counts)
 * Follows separation of concerns by encapsulating artist stats logic
 */

import { useEffect, useState, useCallback } from 'react';
import { getArtistStats, ArtistStats } from '../api/artistStatsService';

interface UseArtistStatsReturn {
  stats: ArtistStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and manage artist statistics
 * @param artistId - Optional artist ID. If not provided, returns null stats
 * @returns Object containing stats, loading state, error, and refetch function
 */
export const useArtistStats = (artistId?: string): UseArtistStatsReturn => {
  const [stats, setStats] = useState<ArtistStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!artistId) {
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const artistStats = await getArtistStats(artistId);
      setStats(artistStats);
    } catch (err) {
      setError('Failed to fetch artist statistics');
      console.error('useArtistStats error:', err);
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
