import { SearchSongsResponse } from '../types/song';
import { SearchAlbumsResponse } from '../types/album';

const BASE_URL = 'https://saavn.sumit.co/api';

export const searchSongs = async (
  query: string,
  page: number = 1,
  limit: number = 15
): Promise<SearchSongsResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw error;
  }
};

export const searchAlbums = async (
  query: string,
  page: number = 1,
  limit: number = 15
): Promise<SearchAlbumsResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/albums?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching albums:', error);
    throw error;
  }
};

export const getSongById = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/songs/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching song:', error);
    throw error;
  }
};
