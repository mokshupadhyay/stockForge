import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Stock } from '../../types/stock';
import { StockCard } from '../StockCard';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './StockList.styles';

interface StockListItemProps {
    stock: Stock;
    onPress: (stock: Stock) => void;
    category: 'gainers' | 'losers' | 'active';
    formatVolume: (volume: string) => string;
}

const StockListItem: React.FC<StockListItemProps> = ({ stock, onPress, category, formatVolume }) => {
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
                        size={20}
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

const ItemSeparator = () => {
    const { theme } = useTheme();
    return <View style={[styles.separator, { backgroundColor: theme.border }]} />;
};

interface StockListProps {
    data: Stock[];
    viewMode: 'grid' | 'list';
    category: 'gainers' | 'losers' | 'active';
    onStockPress: (stock: Stock) => void;
    showFooter?: boolean;
    footerText?: string;
    isSection?: boolean;
    maxItems?: number;
}

export const StockList: React.FC<StockListProps> = ({
    data,
    viewMode,
    category,
    onStockPress,
    showFooter = false,
    footerText,
    isSection = false,
    maxItems,
}) => {
    const { theme } = useTheme();

    const formatVolume = (volume: string) => {
        const num = parseFloat(volume);
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return volume;
    };

    const displayData = maxItems ? data.slice(0, maxItems) : data;

    const renderStockItem = ({ item }: { item: Stock }) => {
        return (
            <StockListItem
                stock={item}
                onPress={onStockPress}
                category={category}
                formatVolume={formatVolume}
            />
        );
    };

    const renderGridContent = () => {
        const rows = [];
        for (let i = 0; i < displayData.length; i += 2) {
            const rowItems = displayData.slice(i, i + 2);
            rows.push(
                <View key={i} style={styles.gridRow}>
                    {rowItems.map((stock) => (
                        <StockCard
                            key={stock.ticker}
                            stock={stock}
                            onPress={onStockPress}
                            theme={theme}
                            category={category}
                        />
                    ))}
                    {rowItems.length === 1 && <View style={styles.gridItemPlaceholder} />}
                </View>
            );
        }
        return rows;
    };

    const renderFooter = () => {
        if (!showFooter || !footerText) return null;

        return (
            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.text.tertiary }]}>
                    {footerText}
                </Text>
            </View>
        );
    };

    if (viewMode === 'grid') {
        if (isSection) {
            // For section rendering (like in ExploreScreen)
            return (
                <View style={styles.cardGrid}>
                    {displayData.map((stock) => (
                        <StockCard
                            key={stock.ticker}
                            stock={stock}
                            onPress={onStockPress}
                            theme={theme}
                            category={category}
                        />
                    ))}
                </View>
            );
        }

        // For full screen rendering (like in ViewAllScreen)
        return (
            <ScrollView
                style={{ backgroundColor: theme.surface }}
                contentContainerStyle={styles.gridContent}
                showsVerticalScrollIndicator={false}
            >
                {renderGridContent()}
                {renderFooter()}
            </ScrollView>
        );
    }

    // List mode
    return (
        <FlatList
            data={displayData}
            renderItem={renderStockItem}
            keyExtractor={(item) => item.ticker}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { backgroundColor: theme.background }]}
            ListFooterComponent={renderFooter}
            ItemSeparatorComponent={ItemSeparator}
        />
    );
}; 