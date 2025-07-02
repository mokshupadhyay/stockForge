import axios from 'axios';
import { StockData } from '../types/stock';
import {
  BASE_URL,
  API_KEYS,
  API_ENDPOINTS,
  CACHE_CONFIG,
} from '../constants/api';

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

// Cache for API responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Clean up old entries to prevent memory leaks
    this.cleanup();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    if (this.cache.size > CACHE_CONFIG.MAX_CACHED_STOCKS * 4) {
      // 4 periods per stock
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Global cache instance
export const apiCache = new APICache();

export const fetchTopGainersLosers =
  async (): Promise<TopGainersLosersResponse> => {
    const cacheKey = 'top_gainers_losers';

    // Check cache first
    const cachedData = apiCache.get<TopGainersLosersResponse>(cacheKey);
    if (cachedData) {
      console.log('📦 [CACHE] Using cached top gainers/losers data');
      return cachedData;
    }

    try {
      console.log('🚀 [API] Fetching fresh top gainers/losers data...');
      const response = await fetch(
        `${BASE_URL}?function=${API_ENDPOINTS.TOP_GAINERS_LOSERS}&apikey=${API_KEYS.DEMO}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TopGainersLosersResponse = await response.json();

      // Check for API errors
      if ('Error Message' in data || 'Note' in data) {
        throw new Error(
          `API Error: ${
            (data as any)['Error Message'] || (data as any)['Note']
          }`,
        );
      }

      // Cache the successful response
      apiCache.set(cacheKey, data, CACHE_CONFIG.TOP_GAINERS_TTL);
      console.log('✅ [API] Fresh top gainers/losers data fetched and cached');

      return data;
    } catch (error) {
      console.error('❌ [API] Error fetching top gainers/losers:', error);

      // Try to return stale cached data if available
      const staleData = apiCache.get<TopGainersLosersResponse>(cacheKey);
      if (staleData) {
        console.log('⚠️ [CACHE] Using stale cached data due to API error');
        return staleData;
      }

      throw error;
    }
  };

export const stockAPI = {
  async getTopGainersLosers(): Promise<StockData> {
    try {
      console.log('🚀 [API CALL] Starting API request to Alpha Vantage...');
      console.log('📡 [API CALL] URL:', BASE_URL);
      console.log('🔑 [API CALL] Function:', API_ENDPOINTS.TOP_GAINERS_LOSERS);
      console.log('⏰ [API CALL] Timestamp:', new Date().toISOString());

      const response = await axios.get<StockData>(BASE_URL, {
        params: {
          function: API_ENDPOINTS.TOP_GAINERS_LOSERS,
          apikey: API_KEYS.DEMO,
        },
      });

      console.log('✅ [API CALL] SUCCESS - Data received');
      console.log(
        '📊 [API CALL] Top Gainers count:',
        response.data.top_gainers?.length || 0,
      );
      console.log(
        '📉 [API CALL] Top Losers count:',
        response.data.top_losers?.length || 0,
      );
      console.log(
        '📈 [API CALL] Most Active count:',
        response.data.most_actively_traded?.length || 0,
      );
      console.log('🕒 [API CALL] Last Updated:', response.data.last_updated);

      return response.data;
    } catch (error: any) {
      console.error('❌ [API CALL] ERROR - Failed to fetch stock data:', error);

      const status = error?.response?.status;
      const message = error?.message || 'Unknown error';
      const responseData = error?.response?.data;

      // Check for rate limiting
      const isRateLimit =
        status === 429 ||
        message.toLowerCase().includes('rate limit') ||
        message.toLowerCase().includes('quota') ||
        message.toLowerCase().includes('limit exceeded') ||
        responseData?.Note?.includes('rate limit') ||
        responseData?.Information?.includes('rate limit');

      console.error('🔍 [API CALL] Error details:', {
        message,
        status: status || 'No status',
        statusText: error?.response?.statusText || 'No status text',
        isRateLimit,
        responseData,
      });

      // Enhance error message for rate limiting
      if (isRateLimit) {
        const rateLimitError = new Error(
          'API rate limit exceeded - showing cached data',
        );
        rateLimitError.name = 'RateLimitError';
        throw rateLimitError;
      }

      throw error;
    }
  },
};
