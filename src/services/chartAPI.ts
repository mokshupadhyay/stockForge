import { BASE_URL, API_KEYS, API_ENDPOINTS } from '../constants/api';

export interface ChartDataPoint {
  value: number;
  label: string;
  timestamp: string;
}

export interface ChartData {
  symbol: string;
  period: string;
  data: ChartDataPoint[];
  source: 'api' | 'fallback';
  lastUpdated: string;
}

export interface TimeSeriesData {
  [timestamp: string]: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };
}

export interface APIResponse {
  'Meta Data'?: any;
  'Time Series (5min)'?: TimeSeriesData;
  'Time Series (60min)'?: TimeSeriesData;
  'Time Series (Daily)'?: TimeSeriesData;
  'Monthly Time Series'?: TimeSeriesData;
  'Error Message'?: string;
  Note?: string;
  Information?: string;
}

class ChartDataService {
  // Generate consistent dummy data patterns for all stocks
  private generateFallbackData(
    symbol: string,
    period: string,
    basePrice: number,
  ): ChartDataPoint[] {
    const points: ChartDataPoint[] = [];
    const now = new Date();

    // Ensure we have a valid base price
    const price = basePrice > 0 ? basePrice : 100;

    // Use consistent patterns instead of random variations
    const getConsistentPattern = (index: number, totalPoints: number) => {
      // Create a subtle wave pattern that's the same for all stocks
      const wave = Math.sin((index / totalPoints) * Math.PI * 2) * 0.01; // ±1%
      const trend = (index / totalPoints) * 0.02; // +2% overall trend
      return price * (1 + wave + trend);
    };

    switch (period) {
      case '1D':
        // Hours for today (9 AM to 4 PM = 7 hours)
        for (let i = 0; i < 7; i++) {
          const hour = 9 + i;
          const currentPrice = Math.max(0.01, getConsistentPattern(i, 7));
          const timestamp = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hour,
          ).toISOString();

          points.push({
            value: currentPrice,
            label: `${hour}:00`,
            timestamp,
          });
        }
        break;

      case '1W':
        // Last 5 trading days ending today
        for (let i = 4; i >= 0; i--) {
          const currentPrice = Math.max(0.01, getConsistentPattern(4 - i, 5));
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dayName = date.toLocaleDateString('en-US', {
            weekday: 'short',
          });

          points.push({
            value: currentPrice,
            label: dayName,
            timestamp: date.toISOString(),
          });
        }
        break;

      case '1M':
        // Last 30 days ending today
        for (let i = 29; i >= 0; i--) {
          const currentPrice = Math.max(0.01, getConsistentPattern(29 - i, 30));
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dayNumber = date.getDate();

          // Show label only for every 5th day or first/last day to avoid crowding
          const showLabel = (29 - i) % 5 === 0 || i === 29 || i === 0;
          const label = showLabel ? dayNumber.toString() : '';

          points.push({
            value: currentPrice,
            label: label,
            timestamp: date.toISOString(),
          });
        }
        break;

      case '1Y':
        // Last 12 months ending this month
        for (let i = 11; i >= 0; i--) {
          const currentPrice = Math.max(0.01, getConsistentPattern(11 - i, 12));
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = date.toLocaleDateString('en-US', {
            month: 'short',
          });

          points.push({
            value: currentPrice,
            label: monthName,
            timestamp: date.toISOString(),
          });
        }
        break;
    }

    console.log(
      `🔄 [FALLBACK] Generated ${points.length} data points for ${symbol} ${period}`,
    );
    return points;
  }

  // Process API response data
  private processApiData(
    data: APIResponse,
    period: string,
    symbol: string,
  ): ChartDataPoint[] {
    try {
      let timeSeries: TimeSeriesData = {};

      // Extract time series based on API response structure
      if (data['Time Series (5min)']) {
        timeSeries = data['Time Series (5min)'];
      } else if (data['Time Series (60min)']) {
        timeSeries = data['Time Series (60min)'];
      } else if (data['Time Series (Daily)']) {
        timeSeries = data['Time Series (Daily)'];
      } else if (data['Monthly Time Series']) {
        timeSeries = data['Monthly Time Series'];
      } else {
        console.log(
          `❌ [CHART API] No time series data found for ${symbol} ${period}`,
        );
        return [];
      }

      const maxPoints =
        period === '1D' ? 7 : period === '1W' ? 5 : period === '1M' ? 30 : 12;
      const entries = Object.entries(timeSeries).slice(0, maxPoints);
      const points: ChartDataPoint[] = [];

      entries.reverse().forEach(([timestamp, values], index) => {
        const closePrice = parseFloat(values['4. close']);
        let label = '';

        switch (period) {
          case '1D':
            // Show hours (HH:MM format)
            const time = new Date(timestamp);
            label = time.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: false,
            });
            break;
          case '1W':
            // Show day names
            const dayDate = new Date(timestamp);
            label = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
            break;
          case '1M':
            // Show day numbers with spacing - every 5th day
            const monthDate = new Date(timestamp);
            const dayNumber = monthDate.getDate();
            const showLabel =
              index % 5 === 0 || index === 0 || index === entries.length - 1;
            label = showLabel ? dayNumber.toString() : '';
            break;
          case '1Y':
            // Show month names
            const yearDate = new Date(timestamp);
            label = yearDate.toLocaleDateString('en-US', { month: 'short' });
            break;
        }

        points.push({
          value: closePrice,
          label: label,
          timestamp: timestamp,
        });
      });

      return points;
    } catch (error) {
      console.error(
        `❌ [CHART API] Error processing API data for ${symbol} ${period}:`,
        error,
      );
      return [];
    }
  }

  // Fetch chart data - Try API first, fallback to dummy data
  async fetchChartData(
    symbol: string,
    period: string,
    basePrice: number,
  ): Promise<ChartData> {
    try {
      // Determine API function and parameters
      let apiFunction = '';
      let interval = '';

      switch (period) {
        case '1D':
          apiFunction = API_ENDPOINTS.TIME_SERIES_INTRADAY;
          interval = '&interval=60min'; // 1-hour intervals
          break;
        case '1W':
        case '1M':
          apiFunction = API_ENDPOINTS.TIME_SERIES_DAILY;
          break;
        case '1Y':
          apiFunction = API_ENDPOINTS.TIME_SERIES_MONTHLY;
          break;
      }

      const url = `${BASE_URL}?function=${apiFunction}&symbol=${symbol}${interval}&apikey=${API_KEYS.CHART}`;

      console.log(`🚀 [CHART API] Trying API call for ${symbol} ${period}...`);

      const response = await fetch(url);
      const data: APIResponse = await response.json();

      // Check for API errors or rate limits
      if (data['Error Message'] || data['Note'] || data['Information']) {
        console.log(`⚠️ [CHART API] API not available, using fallback data`);
        throw new Error('API not available');
      }

      // Process the API data
      const processedData = this.processApiData(data, period, symbol);

      if (processedData.length === 0) {
        throw new Error('No valid data points processed');
      }

      const chartData: ChartData = {
        symbol,
        period,
        data: processedData,
        source: 'api',
        lastUpdated: new Date().toISOString(),
      };

      console.log(
        `✅ [CHART API] Successfully got ${processedData.length} data points from API for ${symbol} ${period}`,
      );

      return chartData;
    } catch (error) {
      // Always fall back to generated data when API fails
      console.log(`🔄 [FALLBACK] Using dummy data for ${symbol} ${period}`);
      const fallbackPoints = this.generateFallbackData(
        symbol,
        period,
        basePrice,
      );

      const fallbackData: ChartData = {
        symbol,
        period,
        data: fallbackPoints,
        source: 'fallback',
        lastUpdated: new Date().toISOString(),
      };

      return fallbackData;
    }
  }
}

// Export singleton instance
export const chartDataService = new ChartDataService();
