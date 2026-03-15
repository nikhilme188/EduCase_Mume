/**
 * ArtistItemWithStats Component
 * Wrapper component that fetches and displays artist statistics
 * Follows separation of concerns by encapsulating artist data fetching
 */

import React from 'react';
import ArtistItem from './ArtistItem';
import { useArtistStats } from '../hooks/useArtistStats';
import { Artist } from '../types/artist';

interface ArtistItemWithStatsProps {
  artist: Artist;
  onPress: () => void;
  onMenuPress: (stats?: { totalAlbums?: number; totalSongs?: number }) => void;
  theme: any;
}

/**
 * Renders an ArtistItem with dynamically fetched album and song counts
 * Shows loading spinner while fetching, then displays counts when available
 */
const ArtistItemWithStats: React.FC<ArtistItemWithStatsProps> = ({
  artist,
  onPress,
  onMenuPress,
  theme,
}) => {
  const { stats, loading } = useArtistStats(artist.id);

  return (
    <ArtistItem
      artistImage={artist.image?.[1]?.url || artist.image?.[0]?.url || ''}
      artistName={artist.name}
      albumCount={stats?.totalAlbums || 0}
      songCount={stats?.totalSongs || 0}
      onPress={onPress}
      onMenuPress={() => onMenuPress(stats || { totalAlbums: 0, totalSongs: 0 })}
      theme={theme}
      loadingStats={loading}
    />
  );
};

export default ArtistItemWithStats;
