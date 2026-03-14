import { useMemo } from 'react';
import { AlbumDetail } from '../types/album';

export type AlbumSortType = 'ascending' | 'descending' | 'dateAdded';

export const useSortAlbums = (albums: AlbumDetail[], sortBy: AlbumSortType = 'ascending') => {
  const sortedAlbums = useMemo(() => {
    const albumsCopy = [...albums];

    switch (sortBy) {
      case 'ascending':
        return albumsCopy.sort((a, b) => {
          const nameA = a.name?.toLowerCase() || '';
          const nameB = b.name?.toLowerCase() || '';
          return nameA.localeCompare(nameB);
        });
      case 'descending':
        return albumsCopy.sort((a, b) => {
          const nameA = a.name?.toLowerCase() || '';
          const nameB = b.name?.toLowerCase() || '';
          return nameB.localeCompare(nameA);
        });
      case 'dateAdded':
        return albumsCopy.sort((a, b) => {
          const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          return dateB - dateA; // Newest first
        });
      default:
        return albumsCopy;
    }
  }, [albums, sortBy]);

  const getFilterLabel = () => {
    switch (sortBy) {
      case 'ascending':
        return 'A - Z';
      case 'descending':
        return 'Z - A';
      case 'dateAdded':
        return 'Newest';
      default:
        return 'Sort';
    }
  };

  return {
    sortedAlbums,
    getFilterLabel,
  };
};
