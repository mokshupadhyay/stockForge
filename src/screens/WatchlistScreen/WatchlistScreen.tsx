import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { WatchlistItem, EmptyWatchlistIllustration, WatchlistCreateModal } from '../../components';
import { useTheme } from '../../contexts/ThemeContext';
import { useWatchlistScreenController } from './WatchlistScreen.controller';
import { styles } from './WatchlistScreen.styles';

export const WatchlistScreen: React.FC = () => {
    const { theme } = useTheme();
    const {
        watchlists,
        isEmpty,
        showCreateModal,
        watchlistName,
        nameError,
        inputRef,
        handleCreateWatchlist,
        handleTextChange,
        handleConfirmCreate,
        handleCancelCreate,
    } = useWatchlistScreenController();



    if (isEmpty) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                    <Text style={[styles.title, { color: theme.text.primary }]}>Watchlists</Text>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: theme.surface }]}
                        onPress={handleCreateWatchlist}
                    >
                        <MaterialIcons name="add" size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.emptyContainer}>
                    <View style={styles.svgContainer}>
                        <EmptyWatchlistIllustration theme={theme} width={240} height={240} />
                    </View>

                    <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>
                        No Watchlists Yet
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.text.secondary }]}>
                        Create your first watchlist to track your favorite stocks{'\n'}and stay updated on market movements.
                    </Text>

                    <TouchableOpacity
                        style={[styles.mainCreateButton, { backgroundColor: theme.accent }]}
                        onPress={handleCreateWatchlist}
                    >
                        <Text style={[styles.mainCreateButtonText, { color: theme.background }]}>
                            Create Your First Watchlist
                        </Text>
                    </TouchableOpacity>
                </View>

                <WatchlistCreateModal
                    visible={showCreateModal}
                    onClose={handleCancelCreate}
                    onConfirm={handleConfirmCreate}
                    value={watchlistName}
                    onChangeText={handleTextChange}
                    error={nameError}
                    inputRef={inputRef}
                    theme={theme}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                <Text style={[styles.title, { color: theme.text.primary }]}>Watchlists</Text>
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: theme.surface }]}
                    onPress={handleCreateWatchlist}
                >
                    <MaterialIcons name="add" size={24} color={theme.text.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={[styles.content, { backgroundColor: theme.background }]}
                showsVerticalScrollIndicator={false}
            >
                {watchlists.map((watchlist) => (
                    <WatchlistItem
                        key={watchlist.id}
                        watchlist={watchlist}
                    />
                ))}

                <View style={styles.instructionContainer}>
                    <Text style={[styles.instructionText, { color: theme.text.tertiary }]}>
                        Long press watchlists to delete • Swipe left or long press stocks to remove
                    </Text>
                </View>
            </ScrollView>

            <WatchlistCreateModal
                visible={showCreateModal}
                onClose={handleCancelCreate}
                onConfirm={handleConfirmCreate}
                value={watchlistName}
                onChangeText={handleTextChange}
                error={nameError}
                inputRef={inputRef}
                theme={theme}
            />
        </SafeAreaView>
    );
};
