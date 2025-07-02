import AsyncStorage from '@react-native-async-storage/async-storage';
import { Watchlist } from '../store/slices/watchlistSlice';

const WATCHLISTS_KEY = 'stockforge_watchlists';

export const saveWatchlists = async (
  watchlists: Watchlist[],
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(watchlists);
    await AsyncStorage.setItem(WATCHLISTS_KEY, jsonValue);
    console.log('Watchlists saved successfully:', watchlists.length);
  } catch (error) {
    console.error('Failed to save watchlists:', error);
  }
};

export const loadWatchlists = async (): Promise<Watchlist[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(WATCHLISTS_KEY);
    if (jsonValue != null) {
      const watchlists = JSON.parse(jsonValue);
      console.log('Watchlists loaded successfully:', watchlists.length);
      return watchlists;
    }
    console.log('No saved watchlists found');
    return [];
  } catch (error) {
    console.error('Failed to load watchlists:', error);
    return [];
  }
};

export const clearWatchlists = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(WATCHLISTS_KEY);
    console.log('Watchlists cleared successfully');
  } catch (error) {
    console.error('Failed to clear watchlists:', error);
  }
};
