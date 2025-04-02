import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedPairsState {
  pairs: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SelectedPairsState = {
  pairs: [],
  isLoading: false,
  error: null,
};

const selectedPairsSlice = createSlice({
  name: 'selectedPairs',
  initialState,
  reducers: {
    setSelectedPairs: (state, action: PayloadAction<string[]>) => {
      state.pairs = action.payload;
      state.error = null;
    },
    addPair: (state, action: PayloadAction<string>) => {
      if (!state.pairs.includes(action.payload)) {
        state.pairs.push(action.payload);
      }
      state.error = null;
    },
    removePair: (state, action: PayloadAction<string>) => {
      state.pairs = state.pairs.filter(pair => pair !== action.payload);
      state.error = null;
    },
    clearPairs: (state) => {
      state.pairs = [];
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedPairs,
  addPair,
  removePair,
  clearPairs,
  setLoading,
  setError,
} = selectedPairsSlice.actions;

export default selectedPairsSlice.reducer; 