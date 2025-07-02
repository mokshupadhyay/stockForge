import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch } from '../../store/store';
import {
  Watchlist,
  deleteWatchlist,
  toggleWatchlistCollapse,
  removeStockFromWatchlist,
} from '../../store/slices/watchlistSlice';

type ExploreStackParamList = {
  ExploreMain: undefined;
  ViewAll: { type: 'gainers' | 'losers' | 'active' };
  StockDetail: { stock: any };
};

type NavigationProp = StackNavigationProp<ExploreStackParamList>;

export const useWatchlistItemController = (watchlist: Watchlist) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();

  const handleToggleCollapse = () => {
    console.log(
      '🔄 [WATCHLIST] Toggle collapse for:',
      watchlist.name,
      'Current collapsed:',
      watchlist.isCollapsed,
    );
    dispatch(toggleWatchlistCollapse({ id: watchlist.id }));
  };

  const handleDeleteWatchlist = () => {
    Alert.alert(
      'Delete Watchlist',
      `Are you sure you want to delete "${watchlist.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteWatchlist({ id: watchlist.id }));
          },
        },
      ],
    );
  };

  const handleRemoveStock = (symbol: string) => {
    Alert.alert('Remove Stock', `Remove ${symbol} from "${watchlist.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          dispatch(
            removeStockFromWatchlist({ watchlistId: watchlist.id, symbol }),
          );
        },
      },
    ]);
  };

  const handleStockPress = (stock: any) => {
    // Convert WatchlistStock to Stock format for navigation
    const stockForNavigation = {
      ticker: stock.symbol,
      price: stock.price.toString(),
      change_amount: stock.change.toString(),
      change_percentage: `${stock.changePercent.toFixed(2)}%`,
      volume: '1000000', // Mock volume
    };

    navigation.navigate('StockDetail', { stock: stockForNavigation });
  };

  return {
    // Actions
    handleToggleCollapse,
    handleDeleteWatchlist,
    handleRemoveStock,
    handleStockPress,
  };
};
