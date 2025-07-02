import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Stock } from '../../types/stock';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './StockListItem.styles';

interface StockListItemProps {
    stock: Stock;
    onPress: (stock: Stock) => void;
    category: 'gainers' | 'losers' | 'active';
    formatVolume: (volume: string) => string;
}

export const StockListItem: React.FC<StockListItemProps> = ({
    stock,
    onPress,
    category,
    formatVolume
}) => {
    const { theme } = useTheme();
    const isPositive = parseFloat(stock.change_amount) >= 0;

    const getCategoryIcon = () => {
        switch (category) {
            case 'gainers':
                return 'trending-up';
            case 'losers':
                return 'trending-down';
            case 'active':
                return isPositive ? 'trending-up' : 'trending-down';
            default:
                return 'trending-up';
        }
    };

    const getIconColor = () => {
        switch (category) {
            case 'gainers':
                return theme.success;
            case 'losers':
                return theme.error;
            case 'active':
                return isPositive ? theme.success : theme.error;
            default:
                return theme.success;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.stockItem, { backgroundColor: theme.card }]}
            onPress={() => onPress(stock)}
            activeOpacity={0.7}
        >
            <View style={styles.stockLeft}>
                <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '15' }]}>
                    <MaterialIcons
                        name={getCategoryIcon()}
                        size={30}
                        color={getIconColor()}
                    />
                </View>
                <View style={styles.stockInfo}>
                    <Text style={[styles.ticker, { color: theme.text.primary }]}>{stock.ticker}</Text>
                    <Text style={[styles.volume, { color: theme.text.tertiary }]}>Vol: {formatVolume(stock.volume)}</Text>
                </View>
            </View>

            <View style={styles.stockRight}>
                <Text style={[styles.price, { color: theme.text.primary }]}>${parseFloat(stock.price).toFixed(2)}</Text>
                <Text style={[
                    styles.change,
                    { color: isPositive ? theme.success : theme.error }
                ]}>
                    {isPositive ? '+' : ''}{stock.change_percentage}
                </Text>
            </View>
        </TouchableOpacity>
    );
}; 