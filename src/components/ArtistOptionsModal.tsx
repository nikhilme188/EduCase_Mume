import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Artist } from '../types/artist';

type ArtistOptionType = 'play' | 'playNext' | 'queue' | 'playlist' | 'share';

interface ArtistOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  artist: Artist | null;
  albumCount?: number;
  songCount?: number;
  theme: any;
  onOptionSelect: (option: ArtistOptionType) => void;
}

const ArtistOptionsModal: React.FC<ArtistOptionsModalProps> = ({
  visible,
  onClose,
  artist,
  albumCount = 0,
  songCount = 0,
  theme,
  onOptionSelect,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!visible || !artist) return null;

  const handleOptionPress = (option: ArtistOptionType) => {
    onOptionSelect(option);
    onClose();
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

  const artistImage = artist?.image?.[2]?.url || artist?.image?.[1]?.url || artist?.image?.[0]?.url;

  const options: Array<{ id: ArtistOptionType; label: string; icon: string; color?: string }> = [
    { id: 'play', label: 'Play', icon: 'play-circle' },
    { id: 'playNext', label: 'Play Next', icon: 'arrow-forward-circle' },
    { id: 'queue', label: 'Add to Playing Queue', icon: 'add-circle' },
    { id: 'playlist', label: 'Add to Playlist', icon: 'list' },
    { id: 'share', label: 'Share', icon: 'share-social' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop - tap anywhere above modal to close */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal at Bottom */}
        <View style={[styles.optionsModal, { backgroundColor: theme.background }]}>
          {/* Header with Image and Artist Info */}
          <View style={styles.modalHeader}>
            {/* Artist Image */}
            {artistImage && (
              <Image
                source={{ uri: artistImage }}
                style={styles.artistImage}
              />
            )}

            {/* Artist Info */}
            <View style={styles.artistInfo}>
              <Text style={[styles.artistName, { color: theme.text }]} numberOfLines={1}>
                {artist?.name}
              </Text>
              <Text style={[styles.artistMeta, { color: '#888888' }]} numberOfLines={2}>
                {albumCount > 0 ? `${albumCount} Album${albumCount !== 1 ? 's' : ''}` : ''} 
                {albumCount > 0 && songCount > 0 ? ' | ' : ''}
                {songCount > 0 ? `${songCount} Song${songCount !== 1 ? 's' : ''}` : ''}
              </Text>
            </View>

            {/* Favorite Heart Button */}
            <TouchableOpacity onPress={handleFavoritePress} style={styles.heartButton}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#FF8216' : theme.text}
              />
            </TouchableOpacity>
          </View>

          {/* Options List */}
          <ScrollView style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                onPress={() => handleOptionPress(option.id)}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={option.color || '#FF8216'}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    {
                      color: option.color || theme.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionsModal: {
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistMeta: {
    fontSize: 12,
    lineHeight: 16,
  },
  heartButton: {
    padding: 8,
  },
  optionsList: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ArtistOptionsModal;
