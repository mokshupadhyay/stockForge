import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState, AppDispatch } from '../../store/store';
import { fetchStockData } from '../../store/slices/stockSlice';
import { Stock } from '../../types/stock';

type ExploreStackParamList = {
  ExploreMain: undefined;
  ViewAll: { type: 'gainers' | 'losers' | 'active' };
  StockDetail: { stock: Stock };
};

type ExploreScreenNavigationProp = StackNavigationProp<
  ExploreStackParamList,
  'ExploreMain'
>;

export const useExploreScreenController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<ExploreScreenNavigationProp>();

  const {
    topGainers,
    topLosers,
    mostActivelyTraded,
    loading,
    error,
    lastUpdated,
    lastFetched,
    isUsingCachedData,
    apiRateLimited,
  } = useSelector((state: RootState) => state.stocks);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isScrollingSearchResults, setIsScrollingSearchResults] =
    useState(false);

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Fetch stock data on app start
    console.log('🎬 [UI] App started - Triggering initial API call...');
    console.log('🕐 [UI] App start timestamp:', new Date().toISOString());
    dispatch(fetchStockData());
  }, [dispatch]);

  // Search functionality
  const getAllStocks = (): Stock[] => {
    return [...topGainers, ...topLosers, ...mostActivelyTraded];
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    // Search starts from 1 character
    const allStocks = getAllStocks();
    const queryLower = query.toLowerCase();

    // Filter and categorize results
    const startsWithQuery: Stock[] = [];
    const containsQuery: Stock[] = [];

    allStocks.forEach(stock => {
      const tickerLower = stock.ticker.toLowerCase();
      if (tickerLower.startsWith(queryLower)) {
        startsWithQuery.push(stock);
      } else if (tickerLower.includes(queryLower)) {
        containsQuery.push(stock);
      }
    });

    // Sort each category alphabetically
    startsWithQuery.sort((a, b) => a.ticker.localeCompare(b.ticker));
    containsQuery.sort((a, b) => a.ticker.localeCompare(b.ticker));

    // Combine: starts with first, then contains
    const filtered = [...startsWithQuery, ...containsQuery];

    // Remove duplicates based on ticker
    const uniqueResults = filtered.filter(
      (stock, index, self) =>
        index === self.findIndex(s => s.ticker === stock.ticker),
    );

    setSearchResults(uniqueResults);
    setShowSearchResults(true);
  };

  const handleSearchResultPress = (stock: Stock) => {
    setShowSearchResults(false);
    setSearchQuery('');
    setSearchResults([]);
    console.log('🔍 [SEARCH] Stock selected:', stock.ticker);
    navigation.navigate('StockDetail', { stock });
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 1) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow for result tap
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  const handleRefresh = () => {
    console.log('🔄 [UI] Pull-to-refresh triggered - Making API call...');
    console.log('🕐 [UI] Refresh timestamp:', new Date().toISOString());
    dispatch(fetchStockData());
  };

  const handleStockPress = (stock: Stock) => {
    console.log('Stock pressed:', stock.ticker);
    navigation.navigate('StockDetail', { stock });
  };

  const handleViewAll = (type: 'gainers' | 'losers' | 'active') => {
    console.log('📄 [UI] "View All" tapped - Using cached data (NO API CALL)');
    console.log('📂 [UI] Navigating to:', type);
    console.log('🕐 [UI] Navigation timestamp:', new Date().toISOString());
    navigation.navigate('ViewAll', { type });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'));
  };

  return {
    // State
    topGainers,
    topLosers,
    mostActivelyTraded,
    loading,
    error,
    lastUpdated,
    lastFetched,
    isUsingCachedData,
    apiRateLimited,
    searchQuery,
    showSearchResults,
    searchResults,
    showThemeSelector,
    isScrollingSearchResults,
    viewMode,

    // Actions
    handleSearch,
    handleSearchResultPress,
    handleSearchFocus,
    handleSearchBlur,
    handleRefresh,
    handleStockPress,
    handleViewAll,
    clearSearch,
    setShowThemeSelector,
    setIsScrollingSearchResults,
    toggleViewMode,
  };
};
