import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './slices/stockSlice';
import watchlistReducer from './slices/watchlistSlice';
import chartReducer from './slices/chartSlice';

export const store = configureStore({
  reducer: {
    stocks: stockReducer,
    watchlist: watchlistReducer,
    chart: chartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
