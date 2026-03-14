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
import { Song } from '../types/song';
import { SONG_OPTIONS } from '../constants/songOptions';

type OptionType = 'playNext' | 'queue' | 'playlist' | 'album' | 'artist' | 'details' | 'ringtone' | 'blacklist' | 'share' | 'delete';

interface SongOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  song: Song | null;
  theme: any;
  onOptionSelect: (option: OptionType) => void;
}

const SongOptionsModal: React.FC<SongOptionsModalProps> = ({
  visible,
  onClose,
  song,
  theme,
  onOptionSelect,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!visible || !song) return null;

  const handleOptionPress = (option: OptionType) => {
    onOptionSelect(option);
    onClose();
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

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
          {/* Header with Image and Song Info */}
          <View style={styles.modalHeader}>
            {/* Song Image */}
            {song?.image?.[2]?.url && (
              <Image
                source={{ uri: song.image[2].url }}
                style={styles.songImage}
              />
            )}

            {/* Song Info */}
            <View style={styles.songInfo}>
              <Text style={[styles.songName, { color: theme.text }]} numberOfLines={1}>
                {song?.name}
              </Text>
              <Text style={[styles.artistName, { color: '#888888' }]} numberOfLines={1}>
                {song?.artists?.primary?.[0]?.name || 'Unknown Artist'}
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
            {SONG_OPTIONS.map((option) => (
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
  songImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 8,
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 12,
  },
  heartButton: {
    padding: 4,
  },
  optionsList: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SongOptionsModal;
