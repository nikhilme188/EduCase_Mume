type OptionType = 'playNext' | 'queue' | 'playlist' | 'album' | 'artist' | 'details' | 'ringtone' | 'blacklist' | 'share' | 'delete';

export interface SongOption {
  id: OptionType;
  label: string;
  icon: string;
  color?: string;
}

/**
 * Constant array of song context menu options.
 * Defines all available actions a user can perform on a song.
 */
export const SONG_OPTIONS: SongOption[] = [
  { id: 'playNext', label: 'Play Next', icon: 'play' },
  { id: 'queue', label: 'Add to Playing Queue', icon: 'list' },
  { id: 'playlist', label: 'Add to Playlist', icon: 'add-circle' },
  { id: 'album', label: 'Go to Album', icon: 'disc' },
  { id: 'artist', label: 'Go to Artist', icon: 'person' },
  { id: 'details', label: 'Details', icon: 'document-text' },
  { id: 'ringtone', label: 'Set as Ringtone', icon: 'call' },
  { id: 'blacklist', label: 'Add to Blacklist', icon: 'ban' },
  { id: 'share', label: 'Share', icon: 'share-social' },
  { id: 'delete', label: 'Delete from Device', icon: 'trash', color: '#FF4444' },
];
