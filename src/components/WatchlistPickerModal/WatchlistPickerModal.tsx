import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Stock } from '../../types/stock';
import { useTheme } from '../../contexts/ThemeContext';
import { useWatchlistPickerModalController } from './WatchlistPickerModal.controller';
import { styles } from './WatchlistPickerModal.styles';
import { WatchlistCreateModal } from '../WatchlistCreateModal';

interface WatchlistPickerModalProps {
    visible: boolean;
    onClose: () => void;
    stock: Stock;
}

export const WatchlistPickerModal: React.FC<WatchlistPickerModalProps> = ({
    visible,
    onClose,
    stock,
}) => {
    const { theme } = useTheme();
    const {
        watchlists,
        isLoaded,
        showCreateModal,
        newWatchlistName,
        nameError,
        inputRef,
        handleSelectWatchlist,
        handleCreateWatchlist,
        handleConfirmCreate,
        handleCancelCreate,
        handleTextChange,
        isStockAlreadyInWatchlist,
    } = useWatchlistPickerModalController({
        onClose,
        stock,
    });

    const renderWatchlistItem = ({ item }: { item: any }) => {
        const isStockAlreadyAdded = isStockAlreadyInWatchlist(item);

        return (
            <TouchableOpacity
                style={[
                    styles.watchlistItem,
                    { backgroundColor: theme.card, borderBottomColor: theme.border },
                    isStockAlreadyAdded && styles.disabledItem
                ]}
                onPress={() => !isStockAlreadyAdded && handleSelectWatchlist(item.id)}
                disabled={isStockAlreadyAdded}
            >
                <View style={styles.watchlistInfo}>
                    <Text style={[
                        styles.watchlistName,
                        { color: theme.text.primary },
                        isStockAlreadyAdded && styles.disabledText
                    ]}>
                        {item.name}
                    </Text>
                    <Text style={[
                        styles.stockCount,
                        { color: theme.text.secondary },
                        isStockAlreadyAdded && styles.disabledText
                    ]}>
                        {item.stocks.length} stocks
                    </Text>
                </View>
                {isStockAlreadyAdded ? (
                    <MaterialIcons name="check" size={20} color={theme.success} />
                ) : (
                    <MaterialIcons name="chevron-right" size={20} color={theme.text.tertiary} />
                )}
            </TouchableOpacity>
        );
    };



    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="overFullScreen"
                statusBarTranslucent={true}
                onRequestClose={onClose}
            >
                <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                    <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                        <Text style={[styles.title, { color: theme.text.primary }]}>Add to Watchlist</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.closeButton, { backgroundColor: theme.surface }]}
                            activeOpacity={0.7}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialIcons name="close" size={24} color={theme.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.stockInfo, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                        <Text style={[styles.stockTicker, { color: theme.text.primary }]}>{stock.ticker}</Text>
                        <Text style={[styles.stockPrice, { color: theme.text.primary }]}>${parseFloat(stock.price).toFixed(2)}</Text>
                    </View>

                    {!isLoaded ? (
                        <View style={styles.emptyState}>
                            <MaterialIcons name="hourglass-empty" size={48} color="#9CA3AF" />
                            <Text style={styles.emptyTitle}>Loading Watchlists...</Text>
                        </View>
                    ) : watchlists.length === 0 ? (
                        <View style={[styles.emptyState, { backgroundColor: theme.background }]}>
                            <MaterialIcons name="bookmark-border" size={48} color={theme.text.tertiary} />
                            <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>No Watchlists Yet</Text>
                            <Text style={[styles.emptySubtitle, { color: theme.text.secondary }]}>
                                Create your first watchlist to start tracking stocks
                            </Text>
                            <TouchableOpacity
                                style={[styles.createButton, { backgroundColor: theme.accent }]}
                                onPress={handleCreateWatchlist}
                            >
                                <MaterialIcons name="add" size={20} color={theme.background} />
                                <Text style={[styles.createButtonText, { color: theme.background }]}>Create Watchlist</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={[styles.content, { backgroundColor: theme.background }]}>
                            <FlatList
                                data={watchlists}
                                renderItem={renderWatchlistItem}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                            />

                            <TouchableOpacity
                                style={[styles.newWatchlistButton, { borderColor: theme.accent, backgroundColor: `${theme.accent}10` }]}
                                onPress={handleCreateWatchlist}
                            >
                                <MaterialIcons name="add" size={20} color={theme.accent} />
                                <Text style={[styles.newWatchlistButtonText, { color: theme.accent }]}>Create New Watchlist</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </SafeAreaView>
            </Modal>
            <WatchlistCreateModal
                visible={showCreateModal}
                onClose={handleCancelCreate}
                onConfirm={handleConfirmCreate}
                value={newWatchlistName}
                onChangeText={handleTextChange}
                error={nameError}
                inputRef={inputRef}
                theme={theme}
            />
        </>
    );
}; 