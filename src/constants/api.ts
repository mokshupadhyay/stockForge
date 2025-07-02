// API Configuration
export const BASE_URL = 'https://www.alphavantage.co/query';

// Different API keys for different endpoints
export const API_KEYS = {
  // Demo key for top gainers/losers (limited but works)
  DEMO: 'demo',
  // Real key for chart data (full access)
  CHART: 'A5G5R18DZ6UKJS1S',
};

export const API_ENDPOINTS = {
  TOP_GAINERS_LOSERS: 'TOP_GAINERS_LOSERS',
  TIME_SERIES_INTRADAY: 'TIME_SERIES_INTRADAY',
  TIME_SERIES_DAILY: 'TIME_SERIES_DAILY',
  TIME_SERIES_MONTHLY: 'TIME_SERIES_MONTHLY',
  SYMBOL_SEARCH: 'SYMBOL_SEARCH',
};
