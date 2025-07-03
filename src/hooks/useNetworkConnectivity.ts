import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkConnectivity = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial connectivity state
    const checkInitialConnectivity = async () => {
      try {
        const netInfoState = await NetInfo.fetch();
        setIsConnected(netInfoState.isConnected);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking initial connectivity:', error);
        setIsConnected(false);
        setIsLoading(false);
      }
    };

    checkInitialConnectivity();

    // Subscribe to connectivity changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkConnectivity = async (): Promise<boolean> => {
    try {
      const netInfoState = await NetInfo.fetch();
      setIsConnected(netInfoState.isConnected);
      return netInfoState.isConnected ?? false;
    } catch (error) {
      console.error('Error checking connectivity:', error);
      setIsConnected(false);
      return false;
    }
  };

  return {
    isConnected,
    isLoading,
    checkConnectivity,
  };
};
