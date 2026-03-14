import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SortType = 'ascending' | 'descending' | 'dateAdded' | 'year';
type DecadeType = '90s' | '20s' | null;

export interface FilterState {
  visible: boolean;
  sortBy: SortType;
  selectedDecade: DecadeType;
  expandedYear: boolean;
}

const initialState: FilterState = {
  visible: false,
  sortBy: 'ascending',
  selectedDecade: null,
  expandedYear: false,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    openFilter: (state) => {
      state.visible = true;
    },
    closeFilter: (state) => {
      state.visible = false;
      state.expandedYear = false;
    },
    setSortBy: (state, action: PayloadAction<SortType>) => {
      state.sortBy = action.payload;
    },
    setSelectedDecade: (state, action: PayloadAction<DecadeType>) => {
      state.selectedDecade = action.payload;
    },
    toggleExpandedYear: (state) => {
      state.expandedYear = !state.expandedYear;
    },
    setExpandedYear: (state, action: PayloadAction<boolean>) => {
      state.expandedYear = action.payload;
    },
    resetFilter: (state) => {
      return initialState;
    },
  },
});

export const {
  openFilter,
  closeFilter,
  setSortBy,
  setSelectedDecade,
  toggleExpandedYear,
  setExpandedYear,
  resetFilter,
} = filterSlice.actions;

export default filterSlice.reducer;
