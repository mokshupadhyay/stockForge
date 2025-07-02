import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: Stock[];
  isCollapsed: boolean;
  createdAt: string;
}

interface WatchlistState {
  watchlists: Watchlist[];
  isLoaded: boolean;
}

const initialState: WatchlistState = {
  watchlists: [],
  isLoaded: false,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    loadWatchlists: (state, action: PayloadAction<Watchlist[]>) => {
      // Always set all watchlists to collapsed when loading
      state.watchlists = action.payload.map(watchlist => ({
        ...watchlist,
        isCollapsed: true,
      }));
      state.isLoaded = true;
    },
    createWatchlist: (
      state,
      action: PayloadAction<{ name: string; id?: string }>,
    ) => {
      const newWatchlist: Watchlist = {
        id: action.payload.id || Date.now().toString(),
        name: action.payload.name,
        stocks: [],
        isCollapsed: true,
        createdAt: new Date().toISOString(),
      };
      state.watchlists.push(newWatchlist);
    },
    deleteWatchlist: (state, action: PayloadAction<{ id: string }>) => {
      state.watchlists = state.watchlists.filter(
        watchlist => watchlist.id !== action.payload.id,
      );
    },
    renameWatchlist: (
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) => {
      const watchlist = state.watchlists.find(w => w.id === action.payload.id);
      if (watchlist) {
        watchlist.name = action.payload.name;
      }
    },
    toggleWatchlistCollapse: (state, action: PayloadAction<{ id: string }>) => {
      const watchlist = state.watchlists.find(w => w.id === action.payload.id);
      if (watchlist) {
        watchlist.isCollapsed = !watchlist.isCollapsed;
      }
    },
    addStockToWatchlist: (
      state,
      action: PayloadAction<{ watchlistId: string; stock: Stock }>,
    ) => {
      const watchlist = state.watchlists.find(
        w => w.id === action.payload.watchlistId,
      );
      if (watchlist) {
        const exists = watchlist.stocks.some(
          s => s.symbol === action.payload.stock.symbol,
        );
        if (!exists) {
          watchlist.stocks.push(action.payload.stock);
        }
      }
    },
    removeStockFromWatchlist: (
      state,
      action: PayloadAction<{ watchlistId: string; symbol: string }>,
    ) => {
      const watchlist = state.watchlists.find(
        w => w.id === action.payload.watchlistId,
      );
      if (watchlist) {
        watchlist.stocks = watchlist.stocks.filter(
          s => s.symbol !== action.payload.symbol,
        );
      }
    },
  },
});

export const {
  loadWatchlists,
  createWatchlist,
  deleteWatchlist,
  renameWatchlist,
  toggleWatchlistCollapse,
  addStockToWatchlist,
  removeStockFromWatchlist,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;
