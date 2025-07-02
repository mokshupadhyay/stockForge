import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Platform, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  createWatchlist,
  addStockToWatchlist,
  loadWatchlists,
  Stock as WatchlistStock,
} from '../../store/slices/watchlistSlice';
import { Stock } from '../../types/stock';
import {
  saveWatchlists,
  loadWatchlists as loadStoredWatchlists,
} from '../../utils/storage';

interface UseWatchlistPickerModalControllerProps {
  onClose: () => void;
  stock: Stock;
}

export const useWatchlistPickerModalController = ({
  onClose,
  stock,
}: UseWatchlistPickerModalControllerProps) => {
  const dispatch = useDispatch();
  const { watchlists, isLoaded } = useSelector(
    (state: RootState) => state.watchlist,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [nameError, setNameError] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Load watchlists on component mount - same as WatchlistScreen
  useEffect(() => {
    const loadSavedWatchlists = async () => {
      if (!isLoaded) {
        console.log('Loading saved watchlists in modal...');
        const savedWatchlists = await loadStoredWatchlists();
        console.log('Loaded watchlists in modal:', savedWatchlists);
        dispatch(loadWatchlists(savedWatchlists));
      }
    };
    loadSavedWatchlists();
  }, [dispatch, isLoaded]);

  // Save watchlists whenever they change - same as WatchlistScreen
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving watchlists from modal:', watchlists.length);
      saveWatchlists(watchlists);
    }
  }, [watchlists, isLoaded]);

  // Stable callback to prevent re-renders
  const handleTextChange = useCallback(
    (text: string) => {
      setNewWatchlistName(text);
      // Clear error when user starts typing
      if (nameError) {
        setNameError('');
      }
    },
    [nameError],
  );

  // Convert Stock to WatchlistStock format
  const convertToWatchlistStock = useCallback(
    (stock: Stock): WatchlistStock => ({
      symbol: stock.ticker,
      name: `Company ${stock.ticker}`, // Mock name - in real app would come from API
      price: parseFloat(stock.price),
      change: parseFloat(stock.change_amount),
      changePercent: parseFloat(stock.change_percentage.replace('%', '')),
    }),
    [],
  );

  const handleSelectWatchlist = useCallback(
    async (watchlistId: string) => {
      const watchlistStock = convertToWatchlistStock(stock);
      dispatch(
        addStockToWatchlist({
          watchlistId,
          stock: watchlistStock,
        }),
      );

      // Save to storage after adding stock
      const updatedWatchlists = watchlists.map(w =>
        w.id === watchlistId
          ? { ...w, stocks: [...w.stocks, watchlistStock] }
          : w,
      );
      await saveWatchlists(updatedWatchlists);

      onClose();
      Alert.alert('Success', `${stock.ticker} added to watchlist!`);
    },
    [stock, watchlists, convertToWatchlistStock, dispatch, onClose],
  );

  const handleCreateWatchlist = useCallback(() => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Create Watchlist',
        'Enter watchlist name:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Create',
            onPress: async (name?: string) => {
              if (name && name.trim()) {
                const watchlistName = name.trim();

                // Check if watchlist with same name already exists
                const existingWatchlist = watchlists.find(
                  w => w.name.toLowerCase() === watchlistName.toLowerCase(),
                );

                if (existingWatchlist) {
                  Alert.alert(
                    'Watchlist Already Exists',
                    `A watchlist named "${watchlistName}" already exists. Please choose a different name.`,
                    [{ text: 'OK' }],
                  );
                  return;
                }

                // Generate unique ID for new watchlist
                const watchlistId = Date.now().toString();
                const watchlistStock = convertToWatchlistStock(stock);

                // Create watchlist first
                dispatch(
                  createWatchlist({
                    name: watchlistName,
                    id: watchlistId,
                  }),
                );

                // Then add stock to the newly created watchlist
                setTimeout(async () => {
                  dispatch(
                    addStockToWatchlist({
                      watchlistId,
                      stock: watchlistStock,
                    }),
                  );

                  // Save to storage
                  const newWatchlist = {
                    id: watchlistId,
                    name: watchlistName,
                    stocks: [watchlistStock],
                    isCollapsed: true,
                    createdAt: new Date().toISOString(),
                  };
                  await saveWatchlists([...watchlists, newWatchlist]);
                }, 100);

                onClose();
                Alert.alert(
                  'Success',
                  `Created "${watchlistName}" and added ${stock.ticker}!`,
                );
              }
            },
          },
        ],
        'plain-text',
      );
    } else {
      // Set default name when opening modal
      setNewWatchlistName('My Watchlist');
      setShowCreateModal(true);
      // Focus input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [watchlists, stock, convertToWatchlistStock, dispatch, onClose]);

  const handleConfirmCreate = useCallback(async () => {
    if (newWatchlistName.trim()) {
      const watchlistName = newWatchlistName.trim();

      // Check if watchlist with same name already exists
      const existingWatchlist = watchlists.find(
        w => w.name.toLowerCase() === watchlistName.toLowerCase(),
      );

      if (existingWatchlist) {
        setNameError(`A watchlist named "${watchlistName}" already exists.`);
        return;
      }

      const watchlistId = Date.now().toString();
      const watchlistStock = convertToWatchlistStock(stock);

      // Create watchlist first
      dispatch(
        createWatchlist({
          name: watchlistName,
          id: watchlistId,
        }),
      );

      // Then add stock to the newly created watchlist
      setTimeout(async () => {
        dispatch(
          addStockToWatchlist({
            watchlistId,
            stock: watchlistStock,
          }),
        );

        // Save to storage
        const newWatchlist = {
          id: watchlistId,
          name: watchlistName,
          stocks: [watchlistStock],
          isCollapsed: true,
          createdAt: new Date().toISOString(),
        };
        await saveWatchlists([...watchlists, newWatchlist]);
      }, 100);

      setNewWatchlistName('');
      setShowCreateModal(false);
      onClose();
      Alert.alert(
        'Success',
        `Created "${watchlistName}" and added ${stock.ticker}!`,
      );
    }
  }, [
    newWatchlistName,
    watchlists,
    stock,
    convertToWatchlistStock,
    dispatch,
    onClose,
  ]);

  const handleCancelCreate = useCallback(() => {
    setNewWatchlistName('');
    setShowCreateModal(false);
    setNameError('');
  }, []);

  const isStockAlreadyInWatchlist = useCallback(
    (watchlist: any) => {
      return watchlist.stocks.some(
        (s: WatchlistStock) => s.symbol === stock.ticker,
      );
    },
    [stock.ticker],
  );

  return {
    // State
    watchlists,
    isLoaded,
    showCreateModal,
    newWatchlistName,
    nameError,
    inputRef,

    // Handlers
    handleSelectWatchlist,
    handleCreateWatchlist,
    handleConfirmCreate,
    handleCancelCreate,
    handleTextChange,

    // Utilities
    convertToWatchlistStock,
    isStockAlreadyInWatchlist,
  };
};
