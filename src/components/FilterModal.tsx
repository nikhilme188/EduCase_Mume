import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  closeFilter,
  setSortBy,
  setSelectedDecade,
  toggleExpandedYear,
  resetFilter,
} from '../store/filterSlice';
import { RootState } from '../store/store';

type SortType = 'ascending' | 'descending' | 'dateAdded' | 'year';
type DecadeType = '90s' | '20s' | null;

interface FilterOption {
  label: string;
  value: SortType;
}

interface DecadeOption {
  label: string;
  value: DecadeType;
}

interface FilterPopupProps {
  theme: any;
  filterType?: 'songs' | 'albums' | 'artists';
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: 'Ascending (A - Z)', value: 'ascending' },
  { label: 'Descending (Z - A)', value: 'descending' },
  { label: 'Date Added (Newest)', value: 'dateAdded' },
  { label: 'Year', value: 'year' },
];

const DECADE_OPTIONS: DecadeOption[] = [
  { label: "90's Songs", value: '90s' },
  { label: "20's Songs", value: '20s' },
];

const FilterPopup: React.FC<FilterPopupProps> = ({ theme, filterType = 'songs' }) => {
  const dispatch = useDispatch();
  const { visible, sortBy, selectedDecade, expandedYear } = useSelector(
    (state: RootState) => state.filter
  );

  // Filter options based on the type
  const displayFilterOptions = filterType === 'albums' 
    ? FILTER_OPTIONS.filter(opt => ['ascending', 'descending', 'dateAdded'].includes(opt.value))
    : filterType === 'artists'
    ? FILTER_OPTIONS.filter(opt => ['ascending', 'descending'].includes(opt.value))
    : FILTER_OPTIONS;

  const handleAppStateChange = (state: AppStateStatus) => {
    if (state === 'background' && visible) {
      dispatch(resetFilter());
    }
  };

  // Close modal when app goes to background
  useEffect(() => {
    if (!visible) return;
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [visible, dispatch]);

  if (!visible) return null;

  const handleOptionPress = (value: SortType) => {
    if (value === 'year') {
      dispatch(toggleExpandedYear());
    } else {
      dispatch(setSortBy(value));
      dispatch(closeFilter());
    }
  };

  const handleDecadePress = (decade: DecadeType) => {
    dispatch(setSelectedDecade(decade));
    dispatch(setSortBy('year'));
    dispatch(closeFilter());
  };

  return (
    <>
      {visible && (
        <View style={styles.filterContainer} pointerEvents="box-none">
          {/* Backdrop - covers entire screen */}
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => {
              dispatch(closeFilter());
            }}
          />

          {/* Popup Box - interactive content */}
          <View
            style={[
              styles.filterPopup,
              { backgroundColor: theme.background },
              expandedYear && styles.filterPopupExpanded,
            ]}
            pointerEvents="auto"
          >
        <ScrollView scrollEnabled={expandedYear} style={styles.filterPopupContent}>
          {displayFilterOptions.map((option) => (
            <View key={option.value}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  sortBy === option.value && styles.filterOptionActive,
                ]}
                onPress={() => handleOptionPress(option.value)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    { color: theme.text },
                    sortBy === option.value && styles.filterOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                <View style={styles.rightContent}>
                  {sortBy === option.value && (
                    <Ionicons name="checkmark" size={20} color="#FF8216" />
                  )}
                  {option.value === 'year' && (
                    <Ionicons
                      name={expandedYear ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#FF8216"
                    />
                  )}
                </View>
              </TouchableOpacity>

              {/* Decade Expansion */}
              {option.value === 'year' && expandedYear && (
                <View style={[styles.decadeContainer, { borderTopColor: theme.text }]}>
                  {DECADE_OPTIONS.map((decade) => (
                    <TouchableOpacity
                      key={decade.value}
                      style={[
                        styles.decadeOption,
                        selectedDecade === decade.value && styles.decadeOptionActive,
                      ]}
                      onPress={() => handleDecadePress(decade.value)}
                    >
                      <Text
                        style={[
                          styles.decadeOptionText,
                          { color: theme.text },
                          selectedDecade === decade.value &&
                            styles.decadeOptionTextActive,
                        ]}
                      >
                        {decade.label}
                      </Text>
                      {selectedDecade === decade.value && (
                        <Ionicons name="checkmark" size={18} color="#FF8216" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  filterPopup: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF8216',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    minWidth: 220,
    maxHeight: 280,
  },
  filterPopupExpanded: {
    maxHeight: 380,
  },
  filterPopupContent: {
    paddingVertical: 4,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterOptionActive: {
    backgroundColor: 'rgba(255, 130, 22, 0.1)',
  },
  filterOptionText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  filterOptionTextActive: {
    fontWeight: '700',
    color: '#FF8216',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  decadeContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 130, 22, 0.05)',
  },
  decadeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  decadeOptionActive: {
    backgroundColor: 'rgba(255, 130, 22, 0.15)',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  decadeOptionText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  decadeOptionTextActive: {
    fontWeight: '700',
    color: '#FF8216',
  },
});

export default FilterPopup;
