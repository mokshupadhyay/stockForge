import { useState, useEffect, useRef } from 'react';
import { Platform, Alert, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  createWatchlist,
  loadWatchlists,
} from '../../store/slices/watchlistSlice';
import {
  saveWatchlists,
  loadWatchlists as loadStoredWatchlists,
} from '../../utils/storage';

export const useWatchlistScreenController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { watchlists, isLoaded } = useSelector(
    (state: RootState) => state.watchlist,
  );

  // Simple modal state for Android
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [watchlistName, setWatchlistName] = useState('');
  const [nameError, setNameError] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Load watchlists on component mount
  useEffect(() => {
    const loadSavedWatchlists = async () => {
      if (!isLoaded) {
        console.log('Loading saved watchlists...');
        const savedWatchlists = await loadStoredWatchlists();
        console.log('Loaded watchlists:', savedWatchlists);
        dispatch(loadWatchlists(savedWatchlists));
      }
    };
    loadSavedWatchlists();
  }, [dispatch, isLoaded]);

  // Save watchlists whenever they change
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving watchlists:', watchlists.length);
      saveWatchlists(watchlists);
    }
  }, [watchlists, isLoaded]);

  const generateWatchlistName = () => {
    const existingNames = watchlists.map(w => w.name);
    let counter = 1;
    let name = `Watchlist ${counter}`;

    while (existingNames.includes(name)) {
      counter++;
      name = `Watchlist ${counter}`;
    }

    return name;
  };

  const handleCreateWatchlist = () => {
    const defaultName = generateWatchlistName();

    if (Platform.OS === 'ios') {
      // Use Alert.prompt for iOS
      Alert.prompt(
        'Create Watchlist',
        'Enter a name for your new watchlist',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Create',
            onPress: (inputName?: string) => {
              const name = inputName?.trim() || defaultName;

              // Check if watchlist with same name already exists
              const existingWatchlist = watchlists.find(
                w => w.name.toLowerCase() === name.toLowerCase(),
              );

              if (existingWatchlist) {
                Alert.alert(
                  'Watchlist Already Exists',
                  `A watchlist named "${name}" already exists. Please choose a different name.`,
                  [{ text: 'OK' }],
                );
                return;
              }

              dispatch(createWatchlist({ name }));
            },
          },
        ],
        'plain-text',
        defaultName,
      );
    } else {
      // Use custom modal for Android
      setWatchlistName(defaultName);
      setShowCreateModal(true);
      // Focus input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  };

  // Stable callback to prevent re-renders
  const handleTextChange = (text: string) => {
    setWatchlistName(text);
    // Clear error when user starts typing
    if (nameError) {
      setNameError('');
    }
  };

  const handleConfirmCreate = () => {
    const name = watchlistName.trim() || generateWatchlistName();

    // Check if watchlist with same name already exists
    const existingWatchlist = watchlists.find(
      w => w.name.toLowerCase() === name.toLowerCase(),
    );

    if (existingWatchlist) {
      setNameError(`A watchlist named "${name}" already exists.`);
      return;
    }

    dispatch(createWatchlist({ name }));
    setShowCreateModal(false);
    setWatchlistName('');
    setNameError('');
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setWatchlistName('');
    setNameError('');
  };

  const isEmpty = watchlists.length === 0;

  return {
    // State
    watchlists,
    isEmpty,
    showCreateModal,
    watchlistName,
    nameError,
    inputRef,

    // Actions
    handleCreateWatchlist,
    handleTextChange,
    handleConfirmCreate,
    handleCancelCreate,
  };
};
