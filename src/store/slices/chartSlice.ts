import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chartDataService, ChartData } from '../../services/chartAPI';

export interface ChartState {
  // Chart data: symbol_period -> ChartData
  chartData: Record<string, ChartData>;
  // Loading states for each chart request
  loadingStates: Record<string, boolean>;
  // Error states
  errors: Record<string, string | null>;
}

const initialState: ChartState = {
  chartData: {},
  loadingStates: {},
  errors: {},
};

// Async thunk to fetch chart data
export const fetchChartData = createAsyncThunk(
  'chart/fetchChartData',
  async (params: { symbol: string; period: string; basePrice: number }) => {
    const { symbol, period, basePrice } = params;
    const chartData = await chartDataService.fetchChartData(
      symbol,
      period,
      basePrice,
    );
    return { key: `${symbol}_${period}`, chartData };
  },
);

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    // Clear all chart data
    clearChartData: state => {
      state.chartData = {};
      state.loadingStates = {};
      state.errors = {};
    },

    // Clear specific chart data
    clearSpecificChart: (
      state,
      action: PayloadAction<{ symbol: string; period: string }>,
    ) => {
      const { symbol, period } = action.payload;
      const key = `${symbol}_${period}`;
      delete state.chartData[key];
      delete state.loadingStates[key];
      delete state.errors[key];
    },
  },
  extraReducers: builder => {
    builder
      // Fetch chart data cases
      .addCase(fetchChartData.pending, (state, action) => {
        const { symbol, period } = action.meta.arg;
        const key = `${symbol}_${period}`;
        state.loadingStates[key] = true;
        state.errors[key] = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        const { key, chartData } = action.payload;
        state.chartData[key] = chartData;
        state.loadingStates[key] = false;
        state.errors[key] = null;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        const { symbol, period } = action.meta.arg;
        const key = `${symbol}_${period}`;
        state.loadingStates[key] = false;
        state.errors[key] =
          action.error.message || 'Failed to fetch chart data';
      });
  },
});

export const { clearChartData, clearSpecificChart } = chartSlice.actions;

export default chartSlice.reducer;

// Selectors
export const selectChartData = (
  state: { chart: ChartState },
  symbol: string,
  period: string,
) => {
  const key = `${symbol}_${period}`;
  return state.chart.chartData[key];
};

export const selectIsChartLoading = (
  state: { chart: ChartState },
  symbol: string,
  period: string,
) => {
  const key = `${symbol}_${period}`;
  return state.chart.loadingStates[key] || false;
};

export const selectChartError = (
  state: { chart: ChartState },
  symbol: string,
  period: string,
) => {
  const key = `${symbol}_${period}`;
  return state.chart.errors[key];
};
