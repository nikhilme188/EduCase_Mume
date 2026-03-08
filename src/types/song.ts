export interface Artist {
  id: string;
  name: string;
  role: string;
  type: string;
  image: Array<{
    quality: string;
    url: string;
  }>;
  url: string;
}

export interface Album {
  id: string | null;
  name: string | null;
  url: string | null;
}

export interface Song {
  id: string;
  name: string;
  type: string;
  year: number | null;
  releaseDate: string | null;
  duration: number | null;
  label: string | null;
  explicitContent: boolean;
  playCount: number | null;
  language: string;
  hasLyrics: boolean;
  lyricsId: string | null;
  url: string;
  copyright: string | null;
  album: Album;
  artists: {
    primary: Artist[];
    featured: Artist[];
    all: Artist[];
  };
  image: Array<{
    quality: string;
    url: string;
  }>;
  downloadUrl: Array<{
    quality: string;
    url: string;
  }>;
}

export interface SearchSongsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Song[];
  };
}
