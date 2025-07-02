import React from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ExploreScreen } from '../screens/ExploreScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { ViewAllScreen } from '../screens/ViewAllScreen';
import { StockDetailScreen } from '../screens/StockDetailScreen';
import { spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ExploreStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExploreMain" component={ExploreScreen} />
            <Stack.Screen name="ViewAll" component={ViewAllScreen} />
            <Stack.Screen name="StockDetail" component={StockDetailScreen} />
        </Stack.Navigator>
    );
};

const WatchlistStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="WatchlistMain" component={WatchlistScreen} />
            <Stack.Screen name="StockDetail" component={StockDetailScreen} />
        </Stack.Navigator>
    );
};

const TabNavigator = () => {
    const { theme } = useTheme();
    // Calculate safe bottom padding for different devices
    const bottomPadding = Platform.OS === 'ios' ? 20 : 10; // Reduced padding

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopColor: theme.border,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: bottomPadding,
                    paddingHorizontal: spacing.lg,
                    height: 65 + bottomPadding, // Reduced height
                    shadowColor: theme.shadow,
                    shadowOffset: {
                        width: 0,
                        height: -4,
                    },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 12,
                },
                tabBarActiveTintColor: theme.accent,
                tabBarInactiveTintColor: theme.text.tertiary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: spacing.xs,
                    marginBottom: spacing.xs,
                },
                tabBarItemStyle: {
                    paddingVertical: spacing.xs,
                },
            }}
        >
            <Tab.Screen
                name="Explore"
                component={ExploreStack}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon="explore" color={color} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Watchlist"
                component={WatchlistStack}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon="watchlist" color={color} focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const TabIcon = ({ icon, color, focused }: { icon: string; color: string; focused: boolean }) => {
    const { theme } = useTheme();

    const getIconName = () => {
        switch (icon) {
            case 'explore':
                return focused ? 'trending-up' : 'trending-up';
            case 'watchlist':
                return focused ? 'bookmark' : 'bookmark-border';
            default:
                return 'help';
        }
    };

    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: focused ? `${theme.accent}15` : 'transparent',
        }}>
            <MaterialIcons
                name={getIconName()}
                size={focused ? 26 : 24}
                color={color}
            />
        </View>
    );
};

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
}; 