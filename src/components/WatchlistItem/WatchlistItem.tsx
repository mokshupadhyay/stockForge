import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Watchlist } from '../../store/slices/watchlistSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { useWatchlistItemController } from './WatchlistItem.controller';
import { styles } from './WatchlistItem.styles';

interface WatchlistItemProps {
    watchlist: Watchlist;
}

// Separate component for individual stock items with swipe functionality
const StockItem: React.FC<{
    stock: any;
    onPress: () => void;
    onRemove: () => void;
}> = ({ stock, onPress, onRemove }) => {
    const { theme } = useTheme();
    const translateX = React.useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
        const { state, translationX } = event.nativeEvent;

        if (state === 5) { // GESTURE_STATE_END
            if (translationX > 100) {
                // Swipe threshold reached - show delete confirmation
                onRemove();
            }

            // Reset position
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <View style={styles.stockItemContainer}>
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetX={20}
                failOffsetY={[-10, 10]}
            >
                <Animated.View style={{ transform: [{ translateX }] }}>
                    <TouchableOpacity
                        style={[styles.stockItem, { backgroundColor: theme.background }]}
                        onPress={onPress}
                        onLongPress={onRemove}
                        activeOpacity={0.7}
                        delayLongPress={500}
                    >
                        <View style={styles.stockInfo}>
                            <Text style={[styles.stockSymbol, { color: theme.text.primary }]}>
                                {stock.symbol}
                            </Text>
                            <Text style={[styles.stockName, { color: theme.text.secondary }]}>
                                {stock.name}
                            </Text>
                        </View>

                        <View style={styles.stockPrice}>
                            <Text style={[styles.price, { color: theme.text.primary }]}>
                                ${stock.price.toFixed(2)}
                            </Text>
                            <Text style={[
                                styles.change,
                                { color: stock.change >= 0 ? theme.success : theme.error }
                            ]}>
                                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </PanGestureHandler>

            {/* Delete Background (shown during swipe) */}
            <Animated.View
                style={[
                    styles.deleteBackground,
                    {
                        opacity: translateX.interpolate({
                            inputRange: [0, 100],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    }
                ]}
            >
                <MaterialIcons name="delete" size={24} color="#FFFFFF" />
                <Text style={styles.deleteText}>Delete</Text>
            </Animated.View>
        </View>
    );
};

export const WatchlistItem: React.FC<WatchlistItemProps> = ({
    watchlist
}) => {
    const { theme } = useTheme();
    const {
        handleToggleCollapse,
        handleDeleteWatchlist,
        handleRemoveStock,
        handleStockPress,
    } = useWatchlistItemController(watchlist);

    return (
        <View style={[styles.container, { backgroundColor: theme.card }]}>
            {/* Header - Always visible, handles tap separately */}
            <TouchableOpacity
                style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}
                onPress={handleToggleCollapse}
                onLongPress={handleDeleteWatchlist}
                activeOpacity={0.7}
                delayLongPress={500}
            >
                <View style={styles.headerLeft}>
                    <Text style={[styles.title, { color: theme.text.primary }]}>
                        {watchlist.name}
                    </Text>
                    <Text style={[styles.stockCount, { color: theme.text.secondary }]}>
                        {watchlist.stocks.length} {watchlist.stocks.length === 1 ? 'stock' : 'stocks'}
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    <MaterialIcons
                        name={watchlist.isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                        size={24}
                        color={theme.text.tertiary}
                    />
                </View>
            </TouchableOpacity>

            {/* Stock List - Only show when expanded */}
            {!watchlist.isCollapsed && (
                <View style={[styles.stockList, { backgroundColor: theme.surface }]}>
                    {watchlist.stocks.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>
                                No stocks added yet
                            </Text>
                            <Text style={[styles.emptySubtext, { color: theme.text.tertiary }]}>
                                Add stocks from any stock detail page
                            </Text>
                        </View>
                    ) : (
                        watchlist.stocks.map((stock) => (
                            <StockItem
                                key={stock.symbol}
                                stock={stock}
                                onPress={() => handleStockPress(stock)}
                                onRemove={() => handleRemoveStock(stock.symbol)}
                            />
                        ))
                    )}
                </View>
            )}
        </View>
    );
}; 