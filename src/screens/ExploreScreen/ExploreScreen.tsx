import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { StockListItem, StockGridItem } from '../../components';
import { LastUpdatedBanner } from '../../components/LastUpdatedBanner';
import { ThemeSelector } from '../../components/ThemeSelector';

import { Stock } from '../../types/stock';
import { useTheme } from '../../contexts/ThemeContext';
import { useExploreScreenController } from './ExploreScreen.controller';
import { styles } from './ExploreScreen.styles';



export const ExploreScreen: React.FC = () => {
    const { theme } = useTheme();
    const {
        // State
        topGainers,
        topLosers,
        mostActivelyTraded,
        loading,
        error,
        lastUpdated,
        lastFetched,
        isUsingCachedData,
        apiRateLimited,
        searchQuery,
        showSearchResults,
        searchResults,
        showThemeSelector,
        isScrollingSearchResults,
        viewMode,

        // Actions
        handleSearch,
        handleSearchResultPress,
        handleSearchFocus,
        handleSearchBlur,
        handleRefresh,
        handleStockPress,
        handleViewAll,
        clearSearch,
        setShowThemeSelector,
        setIsScrollingSearchResults,
        toggleViewMode,
    } = useExploreScreenController();

    const formatVolume = (volume: string) => {
        const num = parseFloat(volume);
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return volume;
    };

    const renderSection = (
        title: string,
        data: Stock[],
        type: 'gainers' | 'losers' | 'active'
    ) => {
        const getSectionIcon = () => {
            switch (type) {
                case 'gainers':
                    return 'trending-up';
                case 'losers':
                    return 'trending-down';
                case 'active':
                    return 'show-chart';
                default:
                    return 'trending-flat';
            }
        };

        const getIconColor = () => {
            switch (type) {
                case 'gainers':
                    return '#10B981'; // Green for gains
                case 'losers':
                    return '#EF4444'; // Red for losses
                case 'active':
                    return '#3B82F6'; // Blue for active trading
                default:
                    return theme.text.tertiary;
            }
        };

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <MaterialIcons
                            name={getSectionIcon()}
                            size={20}
                            color={getIconColor()}
                            style={styles.sectionIcon}
                        />
                        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
                            {title}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleViewAll(type)}>
                        <Text style={[styles.viewAllText, { color: theme.accent }]}>
                            View All →
                        </Text>
                    </TouchableOpacity>
                </View>
                {viewMode === 'grid' ? (
                    <View style={styles.cardGrid}>
                        {data.slice(0, 6).map((stock) => (
                            <StockGridItem
                                key={stock.ticker}
                                stock={stock}
                                onPress={handleStockPress}
                                category={type}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {data.slice(0, 6).map((stock, index) => (
                            <React.Fragment key={stock.ticker}>
                                <StockListItem
                                    stock={stock}
                                    onPress={handleStockPress}
                                    category={type}
                                    formatVolume={formatVolume}
                                />
                                {index < data.slice(0, 6).length - 1 && (
                                    <View style={[styles.separator, { backgroundColor: theme.border }]} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    const renderSearchResults = () => {
        if (!showSearchResults) return null;

        return (
            <View
                style={[styles.searchResults, { backgroundColor: theme.card, borderColor: theme.border }]}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
            >
                {searchResults.length > 0 ? (
                    <ScrollView
                        style={styles.searchResultsList}
                        showsVerticalScrollIndicator={true}
                        keyboardShouldPersistTaps="handled"
                        bounces={true}
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        onScrollBeginDrag={() => {
                            setIsScrollingSearchResults(true);
                        }}
                        onScrollEndDrag={() => {
                            setIsScrollingSearchResults(false);
                        }}
                        onMomentumScrollEnd={() => {
                            setIsScrollingSearchResults(false);
                        }}
                    >
                        {searchResults.map((item) => (
                            <TouchableOpacity
                                key={item.ticker}
                                style={[styles.searchResultItem, { borderBottomColor: theme.border }]}
                                onPress={() => handleSearchResultPress(item)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.searchResultLeft}>
                                    <Text style={[styles.searchResultTicker, { color: theme.text.primary }]}>{item.ticker}</Text>
                                    <Text style={[styles.searchResultPrice, { color: theme.text.secondary }]}>
                                        ${parseFloat(item.price).toFixed(2)}
                                    </Text>
                                </View>
                                <Text style={[
                                    styles.searchResultChange,
                                    { color: parseFloat(item.change_amount) >= 0 ? theme.success : theme.error }
                                ]}>
                                    {parseFloat(item.change_amount) >= 0 ? '+' : ''}{item.change_percentage}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Text style={[styles.noResultsText, { color: theme.text.secondary }]}>
                            No stocks found for "{searchQuery}"
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    if (loading && topGainers.length === 0) {
        return (
            <SafeAreaView style={[styles.centerContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.accent} />
                <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
                    Loading market data...
                </Text>
            </SafeAreaView>
        );
    }

    // Show error only if we don't have any cached data and it's not a rate limit issue
    if (error && !isUsingCachedData && topGainers.length === 0) {
        return (
            <SafeAreaView style={[styles.centerContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                    <Text style={[styles.retryText, { color: theme.accent }]}>
                        Tap to retry
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                <View style={styles.headerTop}>
                    <Text style={[styles.title, { color: theme.text.primary }]}>StockForge</Text>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            onPress={toggleViewMode}
                            style={[styles.viewToggleButton, { backgroundColor: theme.surface }]}
                        >
                            <MaterialIcons
                                name={viewMode === 'grid' ? 'view-list' : 'grid-view'}
                                size={20}
                                color={theme.text.primary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowThemeSelector(true)}
                            style={[styles.themeButton, { backgroundColor: theme.surface }]}
                        >
                            <MaterialIcons name="settings" size={20} color={theme.text.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <LastUpdatedBanner
                    lastUpdated={lastUpdated}
                    lastFetched={lastFetched}
                    isUsingCachedData={isUsingCachedData}
                    apiRateLimited={apiRateLimited}
                    theme={theme}
                />

                <View style={styles.searchContainer}>
                    <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <MaterialIcons name="search" size={20} color={theme.text.tertiary} style={styles.searchIcon} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.text.primary }]}
                            placeholder="Search stocks ..."
                            placeholderTextColor={theme.text.tertiary}
                            value={searchQuery}
                            onChangeText={handleSearch}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            autoCorrect={false}
                            autoCapitalize="characters"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={clearSearch}
                                style={styles.clearButton}
                            >
                                <MaterialIcons name="close" size={20} color={theme.text.tertiary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {renderSearchResults()}
                </View>
            </View>

            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.background }]}
                showsVerticalScrollIndicator={false}
                scrollEnabled={!isScrollingSearchResults && !showSearchResults}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                        tintColor={theme.accent}
                    />
                }
            >
                {renderSection('Top Gainers', topGainers, 'gainers')}
                {renderSection('Top Losers', topLosers, 'losers')}
                {renderSection('Most Active', mostActivelyTraded, 'active')}
            </ScrollView>

            <ThemeSelector
                visible={showThemeSelector}
                onClose={() => setShowThemeSelector(false)}
            />
        </SafeAreaView>
    );
}; 