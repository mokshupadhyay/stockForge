import { useState, useEffect } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { Stock } from '../../types/stock';
import {
  fetchChartData,
  selectChartData,
  selectIsChartLoading,
  selectChartError,
} from '../../store/slices/chartSlice';
import { AppDispatch, RootState } from '../../store/store';

type ExploreStackParamList = {
  ExploreMain: undefined;
  ViewAll: { type: 'gainers' | 'losers' | 'active' };
  StockDetail: { stock: Stock };
};

type StockDetailScreenNavigationProp = StackNavigationProp<
  ExploreStackParamList,
  'StockDetail'
>;
type StockDetailScreenRouteProp = RouteProp<
  ExploreStackParamList,
  'StockDetail'
>;

export const useStockDetailScreenController = () => {
  const navigation = useNavigation<StockDetailScreenNavigationProp>();
  const route = useRoute<StockDetailScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { stock } = route.params;

  const [selectedPeriod, setSelectedPeriod] = useState('1D');
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);

  const periods = ['1D', '1W', '1M', '1Y'];

  // Redux selectors
  const chartData = useSelector((state: RootState) =>
    selectChartData(state, stock.ticker, selectedPeriod),
  );
  const isLoadingChart = useSelector((state: RootState) =>
    selectIsChartLoading(state, stock.ticker, selectedPeriod),
  );
  const chartError = useSelector((state: RootState) =>
    selectChartError(state, stock.ticker, selectedPeriod),
  );

  // Load chart data when component mounts or period changes
  useEffect(() => {
    const basePrice = parseFloat(stock.price);
    console.log(
      `🔄 [STOCK DETAIL] Loading chart for ${stock.ticker} ${selectedPeriod}`,
    );

    dispatch(
      fetchChartData({
        symbol: stock.ticker,
        period: selectedPeriod,
        basePrice: basePrice,
      }),
    );
  }, [dispatch, stock.ticker, selectedPeriod, stock.price]);

  const handlePeriodChange = (period: string) => {
    console.log('🔄 [PERIOD CHANGE] User selected period:', period);
    console.log('📈 [PERIOD CHANGE] Current stock:', stock.ticker);
    console.log('⏰ [PERIOD CHANGE] Timestamp:', new Date().toISOString());
    setSelectedPeriod(period);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddToWatchlist = () => {
    setShowWatchlistModal(true);
  };

  const handleCloseWatchlistModal = () => {
    setShowWatchlistModal(false);
  };

  const handleRetryChart = () => {
    const basePrice = parseFloat(stock.price);
    dispatch(
      fetchChartData({
        symbol: stock.ticker,
        period: selectedPeriod,
        basePrice: basePrice,
      }),
    );
  };

  // Calculate consistent dummy metrics
  const isPositive = parseFloat(stock.change_amount) >= 0;
  const currentPrice = parseFloat(stock.price);
  const volume = parseFloat(stock.volume);

  // Use consistent dummy values for all stocks
  const openPrice = currentPrice - parseFloat(stock.change_amount);
  const highPrice = Math.max(openPrice, currentPrice) * 1.015; // +1.5% from max
  const lowPrice = Math.min(openPrice, currentPrice) * 0.985; // -1.5% from min
  const avgVolume = volume * 0.9; // 90% of current volume

  // Fixed dummy values for financial metrics (same for all stocks)
  const marketCap = 2.5e9; // $2.5B for all stocks

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(1)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(1)}M`;
    return `$${(cap / 1e3).toFixed(1)}K`;
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return volume;
  };

  // Key metrics - show only what we have or use consistent dummy values
  const keyMetrics = [
    { label: 'Open', value: `$${openPrice.toFixed(2)}` },
    { label: 'High', value: `$${highPrice.toFixed(2)}` },
    { label: 'Low', value: `$${lowPrice.toFixed(2)}` },
    { label: 'Volume', value: formatVolume(stock.volume) },
    { label: 'Avg. Volume', value: formatVolume(avgVolume.toFixed(0)) },
    { label: 'Market Cap', value: formatMarketCap(marketCap) },
  ];

  // Generate simple consistent company description
  const generateCompanyDescription = () => {
    let description = `${stock.ticker} stock is ${
      isPositive ? 'rising' : 'losing'
    }. `;

    // Add volume info if available
    if (stock.volume) {
      description += `Volume: ${formatVolume(stock.volume)}.`;
    }

    return description;
  };

  // Prepare chart data for rendering
  const getChartRenderData = () => {
    if (!chartData || !chartData.data || chartData.data.length === 0) {
      return {
        labels: ['Loading...'],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: chartData.data.map(point => point.label),
      datasets: [
        {
          data: chartData.data.map(point => point.value),
          strokeWidth: 3,
        },
      ],
    };
  };

  return {
    // State
    stock,
    selectedPeriod,
    showWatchlistModal,
    periods,
    chartData,
    isLoadingChart,
    chartError,
    isPositive,
    keyMetrics,
    companyDescription: generateCompanyDescription(),

    // Actions
    handlePeriodChange,
    handleGoBack,
    handleAddToWatchlist,
    handleCloseWatchlistModal,
    handleRetryChart,
    getChartRenderData,
  };
};
