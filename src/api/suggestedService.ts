const API_BASE_URL = 'https://saavn.sumit.co/api';

interface SuggestedArtistsResponse {
  success: boolean;
  data: {
    artists: Array<{
      id: string;
      name: string;
      image: Array<{
        quality: string;
        url: string;
      }>;
      url: string;
      type: string;
    }>;
  };
}

export const suggestedService = {
  // Get random artists
  async getRandomArtists(limit: number = 50): Promise<SuggestedArtistsResponse> {
    try {
      // Use alphabetical search with random alphabet index to get varied artists
      const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
      const randomLetters = alphabet
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.ceil(limit / 2));

      const artistsSet = new Set<string>();
      const allArtists: any[] = [];

      for (const letter of randomLetters) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/search/artists?query=${letter}&limit=${limit}`
          );

          if (!response.ok) continue;

          const text = await response.text();
          if (!text) continue;

          const data = JSON.parse(text);
          const artists = data?.data?.results || [];

          for (const artist of artists) {
            if (!artistsSet.has(artist.id)) {
              artistsSet.add(artist.id);
              allArtists.push(artist);
              if (allArtists.length >= limit) break;
            }
          }

          if (allArtists.length >= limit) break;
        } catch (error) {
          console.error(`Error fetching artists for letter ${letter}:`, error);
          continue;
        }
      }

      return {
        success: true,
        data: {
          artists: allArtists.slice(0, limit),
        },
      };
    } catch (error) {
      console.error('Error fetching random artists:', error);
      return {
        success: false,
        data: { artists: [] },
      };
    }
  },

  // Get top/most played songs
  async getTopSongs(limit: number = 50): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/songs?query=trending&limit=${limit}`
      );

      if (!response.ok) {
        console.error(`API returned status ${response.status}`);
        return { success: false, data: { results: [] } };
      }

      const text = await response.text();
      if (!text) {
        return { success: false, data: { results: [] } };
      }

      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('Error fetching top songs:', error);
      return { success: false, data: { results: [] } };
    }
  },

  // Get recently played albums (using popular albums as proxy)
  async getRecentlyPlayed(limit: number = 50): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/albums?query=a&limit=${limit}`
      );

      if (!response.ok) {
        console.error(`API returned status ${response.status}`);
        return { success: false, data: { results: [] } };
      }

      const text = await response.text();
      if (!text) {
        return { success: false, data: { results: [] } };
      }

      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('Error fetching recently played:', error);
      return { success: false, data: { results: [] } };
    }
  },
};
