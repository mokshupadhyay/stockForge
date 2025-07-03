import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../constants/theme';

interface NoInternetScreenProps {
    onRetry: () => void;
}

export const NoInternetScreen: React.FC<NoInternetScreenProps> = ({ onRetry }) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.xl,
        },
        iconContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: `${theme.accent}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.xl,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.text.primary,
            textAlign: 'center',
            marginBottom: spacing.md,
        },
        subtitle: {
            fontSize: 16,
            color: theme.text.secondary,
            textAlign: 'center',
            marginBottom: spacing.xl,
            lineHeight: 22,
        },
        retryButton: {
            backgroundColor: theme.accent,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.lg,
        },
        retryButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
            marginLeft: spacing.sm,
        },
        instructionsContainer: {
            marginTop: spacing.xl,
            paddingHorizontal: spacing.lg,
        },
        instructionText: {
            fontSize: 14,
            color: theme.text.tertiary,
            textAlign: 'center',
            lineHeight: 20,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialIcons
                    name="wifi-off"
                    size={60}
                    color={theme.accent}
                />
            </View>

            <Text style={styles.title}>No Internet Connection</Text>

            <Text style={styles.subtitle}>
                Please check your internet connection and try again. StockForge needs an active internet connection to fetch the latest market data.
            </Text>

            <TouchableOpacity
                style={styles.retryButton}
                onPress={onRetry}
                activeOpacity={0.8}
            >
                <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>

            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionText}>
                    • Check your WiFi or mobile data connection{'\n'}
                    • Make sure you're connected to the internet{'\n'}
                    • Try turning your connection off and on again
                </Text>
            </View>
        </View>
    );
}; 