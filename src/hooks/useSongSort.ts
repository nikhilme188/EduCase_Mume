import { useMemo } from 'react';
import { Song } from '../types/song';

export type SortType = 'ascending' | 'descending' | 'dateAdded' | 'year';
export type DecadeType = '90s' | '20s' | null;

const getDecadeRange = (decade: DecadeType): [number, number] => {
  switch (decade) {
    case '90s':
      return [1990, 1999];
    case '20s':
      return [2020, 2029];
    default:
      return [1900, 2099];
  }
};

const getYearFromSong = (song: Song): number | null => {
  // Try year field first
  if (song.year && !isNaN(song.year)) {
    return song.year;
  }
  
  // Fall back to releaseDate
  if (song.releaseDate) {
    try {
      const yearStr = song.releaseDate.slice(0, 4);
      const year = parseInt(yearStr);
      if (!isNaN(year)) {
        return year;
      }
    } catch (e) {
      console.error('Error parsing release date:', song.releaseDate);
    }
  }
  
  return null;
};

export const useSongSort = (songs: Song[], sortBy: SortType, decade?: DecadeType) => {
  const sortedSongs = useMemo(() => {
    let sorted = [...songs];

    // Filter by decade if year sorting with a specific decade
    if (sortBy === 'year' && decade) {
      const [startYear, endYear] = getDecadeRange(decade);
      
      sorted = sorted.filter((song) => {
        const year = getYearFromSong(song);
        // Only include songs with valid year data
        if (year === null) {
          return false;
        }
        return year >= startYear && year <= endYear;
      });
    }

    switch (sortBy) {
      case 'ascending':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'descending':
        sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      case 'dateAdded':
        sorted.sort((a, b) => {
          const dateA = new Date(a.releaseDate || 0).getTime();
          const dateB = new Date(b.releaseDate || 0).getTime();
          return dateB - dateA; // Newest first
        });
        break;
      case 'year':
        // For year, always sort alphabetically within the decade
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    return sorted;
  }, [songs, sortBy, decade]);

  const getFilterLabel = (): string => {
    switch (sortBy) {
      case 'ascending':
        return 'A - Z';
      case 'descending':
        return 'Z - A';
      case 'dateAdded':
        return 'Date Added';
      case 'year':
        if (decade === '90s') return "90's";
        if (decade === '20s') return "20's";
        return 'Year';
      default:
        return 'Filter';
    }
  };

  return { sortedSongs, getFilterLabel };
};
