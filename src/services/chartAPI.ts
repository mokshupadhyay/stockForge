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

// Simple dummy data generator - same pattern for all stocks
const generateDummyData = (
  symbol: string,
  period: string,
  basePrice: number,
): ChartDataPoint[] => {
  const points: ChartDataPoint[] = [];
  const now = new Date();
  const price = basePrice > 0 ? basePrice : 100;

  // Create consistent wave pattern for all stocks
  const getPrice = (index: number, total: number) => {
    const wave = Math.sin((index / total) * Math.PI * 2) * 0.01; // ±1% wave
    const trend = (index / total) * 0.02; // +2% upward trend
    return Math.max(0.01, price * (1 + wave + trend));
  };

  switch (period) {
    case '1D':
      // 7 hours (9 AM to 4 PM)
      for (let i = 0; i < 7; i++) {
        const hour = 9 + i;
        const timestamp = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hour,
        ).toISOString();
        points.push({
          value: getPrice(i, 7),
          label: `${hour}:00`,
          timestamp,
        });
      }
      break;

    case '1W':
      // 5 trading days
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        points.push({
          value: getPrice(4 - i, 5),
          label: dayName,
          timestamp: date.toISOString(),
        });
      }
      break;

    case '1M':
      // 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayNumber = date.getDate();
        // Show label every 5th day to avoid crowding
        const showLabel = (29 - i) % 5 === 0 || i === 29 || i === 0;
        points.push({
          value: getPrice(29 - i, 30),
          label: showLabel ? dayNumber.toString() : '',
          timestamp: date.toISOString(),
        });
      }
      break;

    case '1Y':
      // 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        points.push({
          value: getPrice(11 - i, 12),
          label: monthName,
          timestamp: date.toISOString(),
        });
      }
      break;
  }

  console.log(
    `[CHART] Generated ${points.length} dummy data points for ${symbol} ${period}`,
  );
  return points;
};

// Try to fetch real data from API (usually fails, so we use dummy data)
const tryFetchRealData = async (
  symbol: string,
  period: string,
): Promise<ChartDataPoint[]> => {
  try {
    // Determine API function
    let apiFunction = '';
    let interval = '';

    switch (period) {
      case '1D':
        apiFunction = API_ENDPOINTS.TIME_SERIES_INTRADAY;
        interval = '&interval=60min';
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
    console.log(`🚀 [CHART] Trying real API for ${symbol} ${period}...`);

    const response = await fetch(url);
    const data = await response.json();

    // Check for API errors
    if (data['Error Message'] || data.Note || data.Information) {
      throw new Error('API not available');
    }

    // Process real API data (simplified)
    const timeSeries =
      data['Time Series (5min)'] ||
      data['Time Series (60min)'] ||
      data['Time Series (Daily)'] ||
      data['Monthly Time Series'];

    if (!timeSeries) {
      throw new Error('No time series data');
    }

    const maxPoints =
      period === '1D' ? 7 : period === '1W' ? 5 : period === '1M' ? 30 : 12;
    const entries = Object.entries(timeSeries).slice(0, maxPoints);
    const points: ChartDataPoint[] = [];

    entries.reverse().forEach(([timestamp, values]: [string, any], index) => {
      const closePrice = parseFloat(values['4. close']);
      let label = '';

      // Create labels based on period
      switch (period) {
        case '1D':
          const time = new Date(timestamp);
          label = time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
          });
          break;
        case '1W':
          const dayDate = new Date(timestamp);
          label = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case '1M':
          const monthDate = new Date(timestamp);
          const dayNumber = monthDate.getDate();
          const showLabel =
            index % 5 === 0 || index === 0 || index === entries.length - 1;
          label = showLabel ? dayNumber.toString() : '';
          break;
        case '1Y':
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

    console.log(
      `✅ [CHART] Got ${points.length} real data points for ${symbol} ${period}`,
    );
    return points;
  } catch (error) {
    console.log(
      `⚠️ [CHART] Real API failed for ${symbol} ${period}, will use dummy data`,
    );
    return [];
  }
};

// Main chart API function - simple and clean
export const chartAPI = {
  async getChartData(
    symbol: string,
    period: string,
    basePrice: number,
  ): Promise<ChartData> {
    console.log(`📈 [CHART] Fetching chart data for ${symbol} ${period}`);

    // Try real API first
    const realData = await tryFetchRealData(symbol, period);

    if (realData.length > 0) {
      // Real API data worked
      return {
        symbol,
        period,
        data: realData,
        source: 'api',
        lastUpdated: new Date().toISOString(),
      };
    }

    // Fall back to dummy data (this is what usually happens)
    const dummyData = generateDummyData(symbol, period, basePrice);

    return {
      symbol,
      period,
      data: dummyData,
      source: 'fallback',
      lastUpdated: new Date().toISOString(),
    };
  },
};

// Legacy export for backward compatibility
export const chartDataService = {
  fetchChartData: chartAPI.getChartData,
};
