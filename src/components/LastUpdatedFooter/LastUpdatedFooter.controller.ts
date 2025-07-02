import { lightTheme } from '../../constants/theme';

interface UseLastUpdatedFooterControllerProps {
    lastUpdated: string | null;
    theme?: typeof lightTheme;
}

export const useLastUpdatedFooterController = ({
    lastUpdated,
    theme = lightTheme,
}: UseLastUpdatedFooterControllerProps) => {
    const formatTimeAgo = (dateString: string) => {
        try {
            // Handle different date formats from Alpha Vantage
            let date = new Date(dateString);

            // If date is invalid, try parsing as Alpha Vantage format
            if (isNaN(date.getTime())) {
                // Alpha Vantage format: "2025-07-01 16:16:00 US/Eastern"
                const cleanedDate = dateString.replace(' US/Eastern', '');
                date = new Date(cleanedDate);
            }

            // If still invalid, return fallback
            if (isNaN(date.getTime())) {
                console.warn('Invalid date format:', dateString);
                return 'recently';
            }

            const now = new Date();
            const diffMs = now.getTime() - date.getTime();

            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            // Less than 1 minute
            if (diffMinutes < 1) {
                return 'just now';
            }

            // Less than 1 hour
            if (diffHours < 1) {
                return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
            }

            // Less than 1 day
            if (diffDays < 1) {
                return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
            }

            // 1 day or more
            return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;

        } catch (error) {
            console.error('Error formatting time:', error);
            return 'unknown time';
        }
    };

    const shouldShow = !!lastUpdated;

    return {
        shouldShow,
        formatTimeAgo,
        theme,
    };
};
