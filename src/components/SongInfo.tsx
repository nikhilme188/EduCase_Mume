import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Song } from '../types/song';

interface SongInfoProps {
  song: Song;
  theme: any;
}

/**
 * Component responsible for displaying song information (name and artist).
 * Separated from playback and action buttons for cleaner concerns.
 */
const SongInfo: React.FC<SongInfoProps> = ({ song, theme }) => {
  const primaryArtist = song.artists?.primary?.[0]?.name || 'Unknown Artist';

  return (
    <View style={styles.songInfo}>
      <Text
        style={[styles.songTitle, { color: theme.text }]}
        numberOfLines={1}
      >
        {song.name}
      </Text>
      <Text style={[styles.artistName, { color: '#888888' }]} numberOfLines={1}>
        {primaryArtist}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 12,
  },
});

export default SongInfo;
