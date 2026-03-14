export interface ArtistImage {
  quality: string;
  url: string;
}

export interface Artist {
  id: string;
  name: string;
  url: string;
  image: ArtistImage[];
  type: string;
}

export interface SearchArtistsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Artist[];
  };
}
