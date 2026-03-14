import { useMemo } from 'react';
import { Artist } from '../types/artist';

export type ArtistSortType = 'ascending' | 'descending';

export const useSortArtists = (artists: Artist[], sortBy: ArtistSortType = 'ascending') => {
  const sortedArtists = useMemo(() => {
    const artistsCopy = [...artists];

    switch (sortBy) {
      case 'ascending':
        return artistsCopy.sort((a, b) => {
          const nameA = a.name?.toLowerCase() || '';
          const nameB = b.name?.toLowerCase() || '';
          return nameA.localeCompare(nameB);
        });
      case 'descending':
        return artistsCopy.sort((a, b) => {
          const nameA = a.name?.toLowerCase() || '';
          const nameB = b.name?.toLowerCase() || '';
          return nameB.localeCompare(nameA);
        });
      default:
        return artistsCopy;
    }
  }, [artists, sortBy]);

  const getFilterLabel = () => {
    switch (sortBy) {
      case 'ascending':
        return 'A - Z';
      case 'descending':
        return 'Z - A';
      default:
        return 'Sort';
    }
  };

  return {
    sortedArtists,
    getFilterLabel,
  };
};
