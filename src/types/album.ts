export interface AlbumArtist {
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

export interface AlbumDetail {
  id: string;
  name: string;
  year: number | null;
  releaseDate: string | null;
  songCount: number;
  language: string;
  url: string;
  artists: {
    primary: AlbumArtist[];
    featured: AlbumArtist[];
    all: AlbumArtist[];
  };
  image: Array<{
    quality: string;
    url: string;
  }>;
}

export interface SearchAlbumsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: AlbumDetail[];
  };
}
