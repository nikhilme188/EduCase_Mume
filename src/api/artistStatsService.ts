/**
 * Artist Stats Service
 * Handles fetching artist statistics (album count, song count, etc.)
 * This service follows separation of concerns by isolating artist-specific data fetching
 */

const BASE_URL = 'https://saavn.sumit.co/api';

export interface ArtistStats {
  totalAlbums: number;
  totalSongs: number;
}

export interface ArtistAlbumsResponse {
  success: boolean;
  data: {
    total: number;
    albums: any[];
  };
}

export interface ArtistSongsResponse {
  success: boolean;
  data: {
    total: number;
    songs: any[];
  };
}

/**
 * Fetch total album count for an artist
 * @param artistId - The ID of the artist
 * @returns Number of albums
 */
export const getArtistAlbumCount = async (artistId: string): Promise<number> => {
  try {
    const response = await fetch(
      `${BASE_URL}/artists/${artistId}/albums?page=1`
    );
    const data: ArtistAlbumsResponse = await response.json();
    return data.success && data.data ? data.data.total : 0;
  } catch (error) {
    console.error('Error fetching artist album count:', error);
    throw error;
  }
};

/**
 * Fetch total song count for an artist
 * @param artistId - The ID of the artist
 * @returns Number of songs
 */
export const getArtistSongCount = async (artistId: string): Promise<number> => {
  try {
    const response = await fetch(
      `${BASE_URL}/artists/${artistId}/songs?page=1`
    );
    const data: ArtistSongsResponse = await response.json();
    return data.success && data.data ? data.data.total : 0;
  } catch (error) {
    console.error('Error fetching artist song count:', error);
    throw error;
  }
};

/**
 * Fetch artist statistics (albums and songs count)
 * @param artistId - The ID of the artist
 * @returns ArtistStats object with totalAlbums and totalSongs
 */
export const getArtistStats = async (artistId: string): Promise<ArtistStats> => {
  try {
    const [totalAlbums, totalSongs] = await Promise.all([
      getArtistAlbumCount(artistId),
      getArtistSongCount(artistId),
    ]);

    return {
      totalAlbums,
      totalSongs,
    };
  } catch (error) {
    console.error('Error fetching artist stats:', error);
    throw error;
  }
};
