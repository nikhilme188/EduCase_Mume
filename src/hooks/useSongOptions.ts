import { useState } from 'react';

type OptionType = 'playNext' | 'queue' | 'playlist' | 'album' | 'artist' | 'details' | 'ringtone' | 'blacklist' | 'share' | 'delete';

interface UseSongOptionsReturn {
  optionsModalVisible: boolean;
  openOptionsModal: () => void;
  closeOptionsModal: () => void;
  handleOptionSelect: (option: OptionType) => void;
}

/**
 * Custom hook for managing song options modal state.
 * Handles modal visibility and option selection callbacks.
 */
export const useSongOptions = (onOptionSelect?: (option: OptionType) => void): UseSongOptionsReturn => {
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const openOptionsModal = () => {
    setOptionsModalVisible(true);
  };

  const closeOptionsModal = () => {
    setOptionsModalVisible(false);
  };

  const handleOptionSelect = (option: OptionType) => {
    if (onOptionSelect) {
      onOptionSelect(option);
    }
    closeOptionsModal();
  };

  return {
    optionsModalVisible,
    openOptionsModal,
    closeOptionsModal,
    handleOptionSelect,
  };
};
