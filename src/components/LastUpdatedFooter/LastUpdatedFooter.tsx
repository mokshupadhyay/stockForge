import React from 'react';
import { View, Text } from 'react-native';
import { lightTheme } from '../../constants/theme';
import { useLastUpdatedFooterController } from './LastUpdatedFooter.controller';
import { styles } from './LastUpdatedFooter.styles';

interface LastUpdatedFooterProps {
    lastUpdated: string | null;
    theme?: typeof lightTheme;
}

export const LastUpdatedFooter: React.FC<LastUpdatedFooterProps> = ({
    lastUpdated,
    theme = lightTheme,
}) => {
    const {
        shouldShow,
        formatTimeAgo,
        theme: controllerTheme,
    } = useLastUpdatedFooterController({
        lastUpdated,
        theme,
    });

    if (!shouldShow) return null;

    return (
        <View style={styles.container}>
            <View style={[styles.divider, { backgroundColor: controllerTheme.border }]} />
            <Text style={[styles.text, { color: controllerTheme.text.tertiary }]}>
                📊 Market data updated {formatTimeAgo(lastUpdated!)}
            </Text>
        </View>
    );
};
