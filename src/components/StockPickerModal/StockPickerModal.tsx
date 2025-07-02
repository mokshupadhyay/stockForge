import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Stock } from '../../store/slices/watchlistSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { useStockPickerModalController } from './StockPickerModal.controller';
import { styles } from './StockPickerModal.styles';

interface StockPickerModalProps {
    visible: boolean;
    watchlistId: string;
    onClose: () => void;
}

export const StockPickerModal: React.FC<StockPickerModalProps> = ({
    visible,
    watchlistId,
    onClose,
}) => {
    const { theme } = useTheme();
    const {
        searchQuery,
        setSearchQuery,
        filteredStocks,
        handleAddStock,
        formatPrice,
        formatChange,
    } = useStockPickerModalController({
        watchlistId,
        onClose,
    });

    const renderStockItem = ({ item }: { item: Stock }) => (
        <TouchableOpacity
            style={[styles.stockItem, { backgroundColor: theme.card }]}
            onPress={() => handleAddStock(item)}
        >
            <View style={styles.stockInfo}>
                <Text style={[styles.stockSymbol, { color: theme.text.primary }]}>
                    {item.symbol}
                </Text>
                <Text style={[styles.stockName, { color: theme.text.secondary }]}>
                    {item.name}
                </Text>
            </View>

            <View style={styles.stockPrice}>
                <Text style={[styles.price, { color: theme.text.primary }]}>
                    {formatPrice(item.price)}
                </Text>
                <Text style={[
                    styles.change,
                    { color: item.change >= 0 ? theme.success : theme.error }
                ]}>
                    {formatChange(item.change, item.changePercent)}
                </Text>
            </View>

            <MaterialIcons name="add" size={24} color={theme.accent} />
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <View style={[styles.container, { backgroundColor: theme.surface }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: theme.background }]}>
                    <Text style={[styles.title, { color: theme.text.primary }]}>
                        Add Stock
                    </Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.closeButton, { backgroundColor: theme.surface }]}
                    >
                        <MaterialIcons name="close" size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: theme.background }]}>
                    <MaterialIcons name="search" size={20} color={theme.text.secondary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text.primary }]}
                        placeholder="Search stocks..."
                        placeholderTextColor={theme.text.secondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Stock List */}
                <FlatList
                    data={filteredStocks}
                    renderItem={renderStockItem}
                    keyExtractor={(item) => item.symbol}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialIcons name="search-off" size={48} color={theme.text.tertiary} />
                            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                                {searchQuery ? 'No stocks found' : 'No stocks available'}
                            </Text>
                        </View>
                    }
                />
            </View>
        </Modal>
    );
}; 