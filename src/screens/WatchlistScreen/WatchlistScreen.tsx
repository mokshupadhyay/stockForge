import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { WatchlistItem, EmptyWatchlistIllustration } from '../../components';
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

    const renderCreateModal = () => {
        if (!showCreateModal) return null;

        return (
            <Modal
                visible={showCreateModal}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancelCreate}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={[styles.modalContainer, { backgroundColor: theme.background, shadowColor: theme.shadow }]}>
                        <Text style={[styles.modalTitle, { color: theme.text.primary }]}>Create Watchlist</Text>
                        <Text style={[styles.modalMessage, { color: theme.text.secondary }]}>Enter a name for your new watchlist</Text>

                        <TextInput
                            key="watchlist-name-input"
                            ref={inputRef}
                            style={[
                                styles.modalInput,
                                {
                                    backgroundColor: theme.surface,
                                    borderColor: theme.border,
                                    color: theme.text.primary
                                },
                                nameError && styles.modalInputError
                            ]}
                            value={watchlistName}
                            onChangeText={handleTextChange}
                            placeholder="Watchlist name"
                            placeholderTextColor={theme.text.tertiary}
                            autoFocus={false}
                            selectTextOnFocus={true}
                            returnKeyType="done"
                            onSubmitEditing={handleConfirmCreate}
                        />

                        {nameError ? (
                            <Text style={[styles.modalError, { color: theme.error }]}>{nameError}</Text>
                        ) : null}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.surface }]}
                                onPress={handleCancelCreate}
                            >
                                <Text style={[styles.cancelButtonText, { color: theme.text.secondary }]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.createButton, { backgroundColor: theme.accent }]}
                                onPress={handleConfirmCreate}
                                disabled={!watchlistName.trim()}
                            >
                                <Text style={[
                                    styles.createButtonText,
                                    { color: theme.background },
                                    !watchlistName.trim() && { opacity: 0.5 }
                                ]}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    };

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

                {renderCreateModal()}
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

            {renderCreateModal()}
        </SafeAreaView>
    );
};
