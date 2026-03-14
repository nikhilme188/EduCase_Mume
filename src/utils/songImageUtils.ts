import { Song } from '../types/song';

/**
 * Utility function to select the best quality image from a song's image array.
 * Prioritizes images in order: high > medium > low > 150x150 > 500x500
 */
export const getBestQualityImage = (song: Song): string => {
  if (!song.image || song.image.length === 0) {
    return '';
  }

  const qualityOrder: Record<string, number> = {
    high: 0,
    medium: 1,
    low: 2,
    '150x150': 3,
    '500x500': 4,
  };

  const sortedImages = [...song.image].sort((a, b) => {
    const aOrder = qualityOrder[a.quality] ?? 999;
    const bOrder = qualityOrder[b.quality] ?? 999;
    return aOrder - bOrder;
  });

  return sortedImages[0]?.url || '';
};
