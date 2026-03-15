import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface Song {
  id: string;
  name: string;
  image: Array<{
    quality: string;
    url: string;
  }>;
  artists?: {
    primary: Array<{
      name: string;
    }>;
  };
}

interface RecentlyPlayedSectionProps {
  songs: Song[];
  loading: boolean;
  theme: any;
  onSongPress: (song: Song) => void;
  onSeeAll: () => void;
}

const RecentlyPlayedSection: React.FC<RecentlyPlayedSectionProps> = ({
  songs,
  loading,
  theme,
  onSongPress,
  onSeeAll,
}) => {
  const renderSongItem = (song: Song) => {
    const imageUrl =
      song.image && song.image.length > 0
        ? song.image[song.image.length - 1]?.url
        : null;

    return (
      <TouchableOpacity
        key={song.id}
        style={styles.songItemContainer}
        onPress={() => onSongPress(song)}
      >
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.songImage}
          />
        )}
        <Text
          style={[styles.songName, { color: theme.text }]}
          numberOfLines={2}
        >
          {song.name}
        </Text>
        <Text
          style={[styles.artistName, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {song.artists?.primary?.[0]?.name || 'Unknown'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Recently Played
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.textSecondary}
          style={styles.loader}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {songs.map((song) => renderSongItem(song))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    marginHorizontal: -15,
    paddingHorizontal: 15,
  },
  songItemContainer: {
    marginRight: 15,
    width: 140,
  },
  songImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 10,
  },
  songName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 11,
  },
  loader: {
    height: 150,
    justifyContent: 'center',
  },
});

export default RecentlyPlayedSection;
