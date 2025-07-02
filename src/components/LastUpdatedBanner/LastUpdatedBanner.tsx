import React from 'react';
import { View, Text } from 'react-native';
import { Theme } from '../../constants/theme';
import { useLastUpdatedBannerController } from './LastUpdatedBanner.controller';
import { styles } from './LastUpdatedBanner.styles';

interface LastUpdatedBannerProps {
    lastUpdated: string | null;
    lastFetched?: string | null;
    isUsingCachedData?: boolean;
    apiRateLimited?: boolean;
    theme: Theme;
}

export const LastUpdatedBanner: React.FC<LastUpdatedBannerProps> = ({
    lastUpdated,
    lastFetched,
    isUsingCachedData = false,
    apiRateLimited = false,
    theme,
}) => {
    const {
        shouldShow,
        formatLastUpdated,
        getBannerColor,
        getTextColor,
        getStatusText,
    } = useLastUpdatedBannerController({
        lastUpdated,
        lastFetched,
        isUsingCachedData,
        apiRateLimited,
    });

    if (!shouldShow) return null;

    return (
        <View style={[styles.container, { backgroundColor: getBannerColor() }]}>
            <View style={styles.compactRow}>
                <Text style={[styles.statusText, { color: getTextColor() }]}>
                    {getStatusText()}
                </Text>
                {lastFetched && (
                    <Text style={[styles.timeText, { color: getTextColor() }]}>
                        {formatLastUpdated(lastFetched)}
                    </Text>
                )}
                {apiRateLimited && (
                    <Text style={[styles.warningIcon, { color: getTextColor() }]}>
                        ⚠️
                    </Text>
                )}
            </View>
        </View>
    );
};
