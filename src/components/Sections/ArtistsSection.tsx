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
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Artist {
  id: string;
  name: string;
  image: Array<{
    quality: string;
    url: string;
  }>;
}

interface ArtistsSectionProps {
  artists: Artist[];
  loading: boolean;
  theme: any;
  onArtistPress: (artist: Artist) => void;
  onSeeAll: () => void;
  hasMore: boolean;
  onLoadMore: () => void;
}

const ArtistsSection: React.FC<ArtistsSectionProps> = ({
  artists,
  loading,
  theme,
  onArtistPress,
  onSeeAll,
  hasMore,
  onLoadMore,
}) => {
  const renderArtistItem = (artist: Artist) => {
    const imageUrl =
      artist.image && artist.image.length > 0
        ? artist.image[artist.image.length - 1]?.url
        : null;

    return (
      <TouchableOpacity
        key={artist.id}
        style={styles.artistItemContainer}
        onPress={() => onArtistPress(artist)}
      >
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.artistImage}
          />
        )}
        <Text
          style={[styles.artistName, { color: theme.text }]}
          numberOfLines={2}
        >
          {artist.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Artists
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={"#FF8216"}
          style={styles.loader}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.scrollView}
          onMomentumScrollEnd={(event) => {
            const { contentSize, contentOffset, layoutMeasurement } =
              event.nativeEvent;
            const isNearEnd =
              contentOffset.x + layoutMeasurement.width >=
              contentSize.width - 100;
            if (isNearEnd && hasMore) {
              onLoadMore();
            }
          }}
        >
          {artists.map((artist) => renderArtistItem(artist))}
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
  artistItemContainer: {
    alignItems: 'center',
    marginRight: 20,
    width: 100,
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  artistName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  loader: {
    height: 150,
    justifyContent: 'center',
  },
});

export default ArtistsSection;
