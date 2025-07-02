import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Stock } from '../../types/stock';
import { Theme } from '../../constants/theme';
import { styles } from './StockCard.styles';

interface StockCardProps {
    stock: Stock;
    onPress: (stock: Stock) => void;
    theme: Theme;
    category: 'gainers' | 'losers' | 'active';
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onPress, theme, category }) => {
    const isPositive = parseFloat(stock.change_amount) >= 0;

    const getIconName = () => {
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

    const formatVolume = (volume: string) => {
        const num = parseFloat(volume);
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return volume;
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: theme.card,
                    shadowColor: theme.shadow,
                }
            ]}
            onPress={() => onPress(stock)}
            activeOpacity={0.8}
        >
            <View style={styles.header}>
                <Text style={[styles.ticker, { color: theme.text.primary }]}>
                    {stock.ticker}
                </Text>
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: getIconColor() + '20' }
                ]}>
                    <MaterialIcons
                        name={getIconName()}
                        size={32}
                        color={getIconColor()}
                    />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={[styles.price, { color: theme.text.primary }]}>
                    ${parseFloat(stock.price).toFixed(2)}
                </Text>
                <Text style={[
                    styles.change,
                    { color: isPositive ? theme.success : theme.error }
                ]}>
                    {isPositive ? '+' : ''}{stock.change_percentage}
                </Text>
            </View>

            <View style={[styles.footer, { borderTopColor: theme.border + '30' }]}>
                <Text style={[styles.volume, { color: theme.text.tertiary }]}>
                    Vol: {formatVolume(stock.volume)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}; 