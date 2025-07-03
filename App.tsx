/**
 * StockForge - Premium Stock Trading Mobile App
 * 
 * @format
 */

import React from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { useNetworkConnectivity } from './src/hooks';
import { NoInternetScreen } from './src/screens';

const AppContent: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { isConnected, isLoading, checkConnectivity } = useNetworkConnectivity();

  const handleRetry = async () => {
    await checkConnectivity();
  };

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (isConnected === false) {
    return (
      <>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <NoInternetScreen onRetry={handleRetry} />
      </>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <AppNavigator />
    </>
  );
};

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
