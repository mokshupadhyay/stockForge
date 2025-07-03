import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { WatchlistPickerModal } from '../../components/WatchlistPickerModal';
import { useTheme } from '../../contexts/ThemeContext';
import { useStockDetailScreenController } from './StockDetailScreen.controller';
import { styles } from './StockDetailScreen.styles';

const { width } = Dimensions.get('window');

export const StockDetailScreen: React.FC = () => {
    const { theme } = useTheme();
    const {
        stock,
        selectedPeriod,
        showWatchlistModal,
        periods,
        isLoadingChart,
        chartError,
        isPositive,
        keyMetrics,
        companyDescription,
        handlePeriodChange,
        handleGoBack,
        handleAddToWatchlist,
        handleCloseWatchlistModal,
        handleRetryChart,
        getChartRenderData,
    } = useStockDetailScreenController();

    const chartConfig = {
        backgroundColor: '#FFFFFF',
        backgroundGradientFrom: '#FFFFFF',
        backgroundGradientTo: '#FFFFFF',
        decimalPlaces: 2,
        color: (opacity = 1) => isPositive ? `rgba(16, 208, 122, ${opacity})` : `rgba(239, 68, 68, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 12,
        },
        propsForDots: {
            r: '0',
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#F3F4F6',
            strokeWidth: 1,
        },
        propsForLabels: {
            fontSize: 11,
        },
        fillShadowGradient: isPositive ? '#10D07A' : '#EF4444',
        fillShadowGradientOpacity: 0.1,
    };

    const renderChartSection = () => {
        if (isLoadingChart) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.accent} />
                    <Text style={[styles.loadingText, { color: theme.text.secondary }]}>Loading chart data...</Text>
                </View>
            );
        }

        if (chartError) {
            return (
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={48} color={theme.error} />
                    <Text style={[styles.errorText, { color: theme.error }]}>Failed to load chart</Text>
                    <Text style={[styles.errorSubtext, { color: theme.text.secondary }]}>{chartError}</Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: theme.accent }]}
                        onPress={handleRetryChart}
                    >
                        <Text style={[styles.retryButtonText, { color: theme.background }]}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <LineChart
                data={getChartRenderData()}
                width={width - 16}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withDots={false}
                withInnerLines={true}
                withOuterLines={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                withShadow={false}
                fromZero={false}
            />
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                <TouchableOpacity
                    onPress={handleGoBack}
                    style={[styles.backButton, { backgroundColor: theme.surface }]}
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Stock Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={[styles.content, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
                {/* Stock Info */}
                <View style={[styles.stockInfo, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.summaryTicker, { color: theme.text.primary }]}>{stock.ticker}</Text>
                    <Text style={[styles.summaryPrice, { color: theme.text.primary }]}>${parseFloat(stock.price).toFixed(2)}</Text>
                    <Text style={[
                        styles.summaryChange,
                        { color: isPositive ? theme.success : theme.error }
                    ]}>
                        Today {isPositive ? '+' : ''}{stock.change_percentage}
                    </Text>
                </View>

                {/* Chart */}
                <View style={styles.chartContainer}>
                    {renderChartSection()}
                </View>

                {/* Time Period Buttons */}
                <View style={styles.periodButtons}>
                    {periods.map((period) => (
                        <TouchableOpacity
                            key={period}
                            style={[
                                styles.periodButton,
                                selectedPeriod === period && styles.selectedPeriodButton
                            ]}
                            onPress={() => handlePeriodChange(period)}
                        >
                            <Text style={[
                                styles.periodButtonText,
                                selectedPeriod === period && styles.selectedPeriodButtonText
                            ]}>
                                {period}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Period Description */}
                <View style={styles.periodDescription}>
                    <Text style={[styles.periodDescriptionText, { color: theme.text.tertiary }]}>
                        {selectedPeriod === '1D' && 'Showing hourly data for today'}
                        {selectedPeriod === '1W' && 'Showing daily data for this week'}
                        {selectedPeriod === '1M' && 'Showing daily data for this month'}
                        {selectedPeriod === '1Y' && 'Showing monthly data for this year'}
                    </Text>
                </View>

                {/* Key Metrics */}
                <View style={styles.keyMetrics}>
                    <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Key Metrics</Text>
                    <View style={styles.metricsGrid}>
                        {keyMetrics.map((metric, index) => (
                            <View key={index} style={styles.metricItem}>
                                <Text style={[styles.metricLabel, { color: theme.text.secondary }]}>{metric.label}</Text>
                                <Text style={[styles.metricValue, { color: theme.text.primary }]}>{metric.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* About Section */}
                <View style={[styles.aboutSection, { borderTopColor: theme.border }]}>
                    <View style={styles.aboutHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>About {stock.ticker}</Text>
                    </View>
                    <Text style={[styles.aboutText, { color: theme.text.secondary }]}>
                        {companyDescription}
                    </Text>
                </View>

                {/* Add to Watchlist Button */}
                <TouchableOpacity
                    style={[styles.watchlistButton, { backgroundColor: theme.accent }]}
                    onPress={handleAddToWatchlist}
                >
                    <Text style={[styles.watchlistButtonText, { color: theme.background }]}>Add to Watchlist</Text>
                </TouchableOpacity>
            </ScrollView>

            <WatchlistPickerModal
                visible={showWatchlistModal}
                onClose={handleCloseWatchlistModal}
                stock={stock}
            />
        </SafeAreaView>
    );
}; 