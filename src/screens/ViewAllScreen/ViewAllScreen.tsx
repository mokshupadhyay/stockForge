import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Stock } from '../../types/stock';
import { StockListItem, StockGridItem } from '../../components';
import { useTheme } from '../../contexts/ThemeContext';
import { useViewAllScreenController } from './ViewAllScreen.controller';
import { styles } from './ViewAllScreen.styles';



const ItemSeparator = () => {
    const { theme } = useTheme();
    return <View style={[styles.separator, { backgroundColor: theme.border }]} />;
};

export const ViewAllScreen: React.FC = () => {
    const { theme } = useTheme();
    const {
        type,
        viewMode,
        data,
        title,
        handleStockPress,
        handleGoBack,
        toggleViewMode,
        formatVolume,
    } = useViewAllScreenController();

    const renderStockItem = ({ item }: { item: Stock }) => {
        if (viewMode === 'grid') {
            return (
                <StockGridItem
                    stock={item}
                    onPress={handleStockPress}
                    category={type}
                />
            );
        }

        return (
            <StockListItem
                stock={item}
                onPress={handleStockPress}
                category={type}
                formatVolume={formatVolume}
            />
        );
    };

    const renderFooter = () => (
        <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text.tertiary }]}>
                You've seen all {data.length} {title.toLowerCase()}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
            <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                <TouchableOpacity
                    onPress={handleGoBack}
                    style={[styles.backButton, { backgroundColor: theme.surface }]}
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
                <TouchableOpacity
                    onPress={toggleViewMode}
                    style={[styles.viewToggleButton, { backgroundColor: theme.surface }]}
                >
                    <MaterialIcons
                        name={viewMode === 'list' ? 'grid-view' : 'view-list'}
                        size={24}
                        color={theme.text.primary}
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                renderItem={renderStockItem}
                keyExtractor={(item) => item.ticker}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={viewMode === 'grid' ? [styles.gridContent, { backgroundColor: theme.surface }] : [styles.listContent, { backgroundColor: theme.background }]}
                ListFooterComponent={data.length > 0 ? renderFooter : null}
                ItemSeparatorComponent={viewMode === 'list' ? ItemSeparator : null}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={viewMode} // Force re-render when switching modes
                columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
            />
        </SafeAreaView>
    );
}; 