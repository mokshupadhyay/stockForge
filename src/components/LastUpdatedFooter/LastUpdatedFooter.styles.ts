import { StyleSheet } from 'react-native';
import { spacing, typography } from '../../constants/theme';

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    divider: {
        height: 1,
        width: '60%',
        marginBottom: spacing.md,
        opacity: 0.3,
    },
    text: {
        ...typography.caption,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
