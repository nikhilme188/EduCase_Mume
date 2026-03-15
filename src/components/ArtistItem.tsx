import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ArtistItemProps {
  artistImage: string;
  artistName: string;
  albumCount?: number;
  songCount?: number;
  onPress?: () => void;
  onMenuPress?: () => void;
  theme: any;
  loadingStats?: boolean;
}

const ArtistItem: React.FC<ArtistItemProps> = ({
  artistImage,
  artistName,
  albumCount = 0,
  songCount = 0,
  onPress,
  onMenuPress,
  theme,
  loadingStats = false,
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.artistCard,
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: artistImage }}
        style={styles.artistImage}
      />
      
      <View style={styles.artistInfo}>
        <Text
          style={[styles.artistName, { color: theme.text }]}
          numberOfLines={1}
        >
          {artistName}
        </Text>
        {loadingStats ? (
          <ActivityIndicator size="small" color="#FF8216" />
        ) : (
          <Text
            style={[styles.artistMeta, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {albumCount > 0 ? `${albumCount} Albums` : ''} 
            {albumCount > 0 && songCount > 0 ? ' | ' : ''}
            {songCount > 0 ? `${songCount} Songs` : ''}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  artistCard: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  artistMeta: {
    fontSize: 12,
  },
});

export default ArtistItem;
