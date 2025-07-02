import { useState, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { addStockToWatchlist, Stock } from '../../store/slices/watchlistSlice';

interface UseStockPickerModalControllerProps {
  watchlistId: string;
  onClose: () => void;
}

export const useStockPickerModalController = ({
  watchlistId,
  onClose,
}: UseStockPickerModalControllerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const stockState = useSelector((state: RootState) => state.stocks);
  const [searchQuery, setSearchQuery] = useState('');

  // Get available stocks from the explore screen data
  const availableStocks = useMemo((): Stock[] => {
    const stocks: Stock[] = [];

    // Add stocks from all categories
    if (stockState.topGainers) {
      stockState.topGainers.forEach((stock: any) => {
        stocks.push({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
        });
      });
    }

    if (stockState.topLosers) {
      stockState.topLosers.forEach((stock: any) => {
        stocks.push({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
        });
      });
    }

    if (stockState.mostActivelyTraded) {
      stockState.mostActivelyTraded.forEach((stock: any) => {
        stocks.push({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
        });
      });
    }

    // Remove duplicates and filter out invalid stocks
    return stocks
      .filter(stock => stock && stock.symbol && stock.name) // Only valid stocks
      .filter(
        (stock, index, self) =>
          index === self.findIndex(s => s.symbol === stock.symbol),
      );
  }, [
    stockState.topGainers,
    stockState.topLosers,
    stockState.mostActivelyTraded,
  ]);

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    return availableStocks.filter(
      stock =>
        (stock.symbol &&
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (stock.name &&
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }, [availableStocks, searchQuery]);

  const handleAddStock = useCallback(
    (stock: Stock) => {
      dispatch(addStockToWatchlist({ watchlistId, stock }));
      Alert.alert(
        'Stock Added',
        `${stock.symbol} has been added to your watchlist.`,
        [{ text: 'OK', onPress: onClose }],
      );
    },
    [dispatch, watchlistId, onClose],
  );

  const formatPrice = useCallback((price: number) => {
    return `$${price.toFixed(2)}`;
  }, []);

  const formatChange = useCallback((change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredStocks,
    handleAddStock,
    formatPrice,
    formatChange,
  };
};
