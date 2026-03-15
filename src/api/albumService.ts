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
    total?: number;
  };
}

export const albumService = {
  async getAlbumSongs(albumId: string): Promise<AlbumSongsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/albums?id=${encodeURIComponent(albumId)}`);
      
      if (!response.ok) {
        console.error(`API returned status ${response.status}`);
        return {
          success: false,
          data: { songs: [] }
        };
      }

      const text = await response.text();
      if (!text) {
        console.warn('Empty response from album songs API');
        return {
          success: false,
          data: { songs: [] }
        };
      }

      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('Error fetching album songs:', error);
      return {
        success: false,
        data: { songs: [] }
      };
    }
  },

  async getArtistSongsPage(artistId: string, page: number): Promise<AlbumSongsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/artists/${encodeURIComponent(artistId)}/songs?page=${page}&limit=50`
      );
      
      if (!response.ok) {
        console.error(`API returned status ${response.status} for page ${page}`);
        return {
          success: false,
          data: { songs: [] }
        };
      }

      const text = await response.text();
      if (!text) {
        console.warn(`Empty response for artist songs page ${page}`);
        return {
          success: false,
          data: { songs: [] }
        };
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(`JSON parse error for page ${page}:`, parseError);
        return {
          success: false,
          data: { songs: [] }
        };
      }

      console.log(`[albumService] Artist songs page ${page}:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching artist songs page ${page}:`, error);
      return {
        success: false,
        data: { songs: [] }
      };
    }
  },
};
