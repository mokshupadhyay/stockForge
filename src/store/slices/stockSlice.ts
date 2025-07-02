import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { stockAPI } from '../../services/stockAPI';
import { Stock, StockData } from '../../types/stock';

interface StockState {
  topGainers: Stock[];
  topLosers: Stock[];
  mostActivelyTraded: Stock[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  lastFetched: string | null;
  isUsingCachedData: boolean;
  apiRateLimited: boolean;
}

const initialState: StockState = {
  topGainers: [],
  topLosers: [],
  mostActivelyTraded: [],
  loading: false,
  error: null,
  lastUpdated: null,
  lastFetched: null,
  isUsingCachedData: false,
  apiRateLimited: false,
};

export const fetchStockData = createAsyncThunk(
  'stocks/fetchStockData',
  async () => {
    console.log('🔄 [REDUX] Dispatching fetchStockData action...');
    console.log('🕐 [REDUX] Dispatch timestamp:', new Date().toISOString());

    const response = await stockAPI.getTopGainersLosers();

    console.log('🎯 [REDUX] API call completed, updating Redux store...');
    return response;
  },
);

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStockData.pending, state => {
        console.log(
          '⏳ [REDUX] fetchStockData.pending - Setting loading state...',
        );
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStockData.fulfilled,
        (state, action: PayloadAction<StockData>) => {
          console.log(
            '✅ [REDUX] fetchStockData.fulfilled - Data received and cached!',
          );
          console.log(
            '📊 [REDUX] Caching Top Gainers:',
            action.payload.top_gainers?.length || 0,
          );
          console.log(
            '📉 [REDUX] Caching Top Losers:',
            action.payload.top_losers?.length || 0,
          );
          console.log(
            '📈 [REDUX] Caching Most Active:',
            action.payload.most_actively_traded?.length || 0,
          );
          console.log(
            '🕒 [REDUX] Data last updated:',
            action.payload.last_updated,
          );

          const fetchTimestamp = new Date().toISOString();
          console.log('🕐 [REDUX] App fetch timestamp:', fetchTimestamp);

          state.loading = false;
          state.topGainers = action.payload.top_gainers;
          state.topLosers = action.payload.top_losers;
          state.mostActivelyTraded = action.payload.most_actively_traded;
          state.lastUpdated = action.payload.last_updated;
          state.lastFetched = fetchTimestamp;
          state.error = null;
          state.apiRateLimited = false;
          state.isUsingCachedData = false;
        },
      )
      .addCase(fetchStockData.rejected, (state, action) => {
        console.log('❌ [REDUX] fetchStockData.rejected - API call failed');
        console.log('🔍 [REDUX] Error message:', action.error.message);

        const errorMessage = action.error.message || '';
        const isRateLimited =
          errorMessage.includes('rate limit') ||
          errorMessage.includes('429') ||
          errorMessage.includes('quota') ||
          errorMessage.includes('limit exceeded');

        state.loading = false;

        // If we have cached data and it's a rate limit error, show cached data
        if (
          isRateLimited &&
          (state.topGainers.length > 0 ||
            state.topLosers.length > 0 ||
            state.mostActivelyTraded.length > 0)
        ) {
          console.log(
            '🔄 [REDUX] Rate limit detected - Using cached data instead of showing error',
          );
          console.log(
            '📊 [REDUX] Cached data available - Graceful fallback activated',
          );
          state.apiRateLimited = true;
          state.isUsingCachedData = true;
          state.error = null; // Don't show error, use cached data
        } else {
          // Only show error if we don't have cached data or it's not a rate limit error
          state.error = action.error.message || 'Failed to fetch stock data';
          state.apiRateLimited = false;
          state.isUsingCachedData = false;
        }
      });
  },
});

export const { clearError } = stockSlice.actions;
export default stockSlice.reducer;
