import { StyleSheet } from 'react-native';
import { spacing } from '../../constants/theme';

export const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.xs,
    },
    compactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '500',
    },
    timeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    warningIcon: {
        fontSize: 10,
    },
});
