import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from '../../store/store';
import { Stock } from '../../types/stock';

type ExploreStackParamList = {
  ExploreMain: undefined;
  ViewAll: { type: 'gainers' | 'losers' | 'active' };
  StockDetail: { stock: Stock };
};

type ViewAllScreenNavigationProp = StackNavigationProp<
  ExploreStackParamList,
  'ViewAll'
>;
type ViewAllScreenRouteProp = RouteProp<ExploreStackParamList, 'ViewAll'>;

export const useViewAllScreenController = () => {
  const navigation = useNavigation<ViewAllScreenNavigationProp>();
  const route = useRoute<ViewAllScreenRouteProp>();
  const { type } = route.params;
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const { topGainers, topLosers, mostActivelyTraded } = useSelector(
    (state: RootState) => state.stocks,
  );

  const getTitle = () => {
    switch (type) {
      case 'gainers':
        return 'Top Gainers';
      case 'losers':
        return 'Top Losers';
      case 'active':
        return 'Most Active';
      default:
        return 'Stocks';
    }
  };

  const getData = (): Stock[] => {
    switch (type) {
      case 'gainers':
        return topGainers;
      case 'losers':
        return topLosers;
      case 'active':
        return mostActivelyTraded;
      default:
        return [];
    }
  };

  const handleStockPress = (stock: Stock) => {
    console.log('Stock pressed:', stock.ticker);
    navigation.navigate('StockDetail', { stock });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
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

  return {
    // State
    type,
    viewMode,
    data: getData(),
    title: getTitle(),

    // Actions
    handleStockPress,
    handleGoBack,
    toggleViewMode,
    formatVolume,
  };
};
