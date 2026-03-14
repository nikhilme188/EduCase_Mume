import { SearchArtistsResponse } from '../types/artist';

const BASE_URL = 'https://saavn.sumit.co/api';

export const searchArtists = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchArtistsResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/artists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching artists:', error);
    throw error;
  }
};
