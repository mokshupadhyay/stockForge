import axios from 'axios';
import { StockData } from '../types/stock';
import { BASE_URL, API_KEYS, API_ENDPOINTS } from '../constants/api';

export interface TopGainersLosersResponse {
  metadata: string;
  last_updated: string;
  top_gainers: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
  top_losers: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
  most_actively_traded: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
}

// Simple API service - Redux store handles caching
export const stockAPI = {
  async getTopGainersLosers(): Promise<StockData> {
    try {
      console.log('🚀 [API] Fetching stock data from Alpha Vantage...');

      const response = await axios.get<StockData>(BASE_URL, {
        params: {
          function: API_ENDPOINTS.TOP_GAINERS_LOSERS,
          apikey: API_KEYS.DEMO,
        },
      });

      console.log('✅ [API] Stock data fetched successfully');
      console.log(
        '📊 [API] Top Gainers:',
        response.data.top_gainers?.length || 0,
      );
      console.log(
        '📉 [API] Top Losers:',
        response.data.top_losers?.length || 0,
      );
      console.log(
        '📈 [API] Most Active:',
        response.data.most_actively_traded?.length || 0,
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ [API] Failed to fetch stock data:', error);

      // Check for rate limiting
      const isRateLimit =
        error?.response?.status === 429 ||
        error?.message?.toLowerCase().includes('rate limit') ||
        error?.response?.data?.Note?.includes('rate limit');

      if (isRateLimit) {
        const rateLimitError = new Error('API rate limit exceeded');
        rateLimitError.name = 'RateLimitError';
        throw rateLimitError;
      }

      throw error;
    }
  },
};
