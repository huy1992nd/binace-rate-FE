import { configureStore } from '@reduxjs/toolkit';
import selectedPairsReducer from './selectedPairsSlice';

export const store = configureStore({
  reducer: {
    selectedPairs: selectedPairsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 