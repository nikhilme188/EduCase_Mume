import { SearchAlbumsResponse } from '../types/album';

const API_BASE_URL = 'https://saavn.sumit.co/api';

interface AlbumSongsResponse {
  success: boolean;
  data: {
    songs: Array<{
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
      album?: {
        id: string;
        name: string;
        url: string;
      };
    }>;
  };
}

export const albumService = {
  async getAlbumSongs(albumId: string): Promise<AlbumSongsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/albums?id=${encodeURIComponent(albumId)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching album songs:', error);
      throw error;
    }
  },

  async getArtistSongs(artistId: string): Promise<AlbumSongsResponse> {
    try {
      // Fetch all pages of artist songs
      let allArtistSongs: any[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(
          `${API_BASE_URL}/artists/${encodeURIComponent(artistId)}/songs?page=${page}&limit=50`
        );
        const data = await response.json();

        console.log(`[albumService] Artist songs page ${page}:`, data);

        if (data.success && data.data?.songs && Array.isArray(data.data.songs)) {
          allArtistSongs = [...allArtistSongs, ...data.data.songs];
          
          // Check if there are more pages (limit * page < total)
          if (data.data.total && allArtistSongs.length < data.data.total) {
            page++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
      }

      return {
        success: true,
        data: {
          songs: allArtistSongs
        }
      };
    } catch (error) {
      console.error('Error fetching artist songs:', error);
      throw error;
    }
  },
};
