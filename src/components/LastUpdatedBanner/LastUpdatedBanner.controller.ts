interface UseLastUpdatedBannerControllerProps {
  lastUpdated: string | null;
  lastFetched?: string | null;
  isUsingCachedData?: boolean;
  apiRateLimited?: boolean;
}

export const useLastUpdatedBannerController = ({
  lastUpdated,
  lastFetched,
  isUsingCachedData = false,
  apiRateLimited = false,
}: UseLastUpdatedBannerControllerProps) => {
  const formatLastUpdated = (dateString: string) => {
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
        return diffMinutes === 1
          ? '1 minute ago'
          : `${diffMinutes} minutes ago`;
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

  const getBannerColor = () => {
    return 'transparent'; // Remove background color for cleaner look
  };

  const getTextColor = () => {
    if (apiRateLimited) return '#F59E0B'; // Orange for rate limit
    if (isUsingCachedData) return '#3B82F6'; // Blue for cached data
    return '#10D07A'; // Green for normal state
  };

  const getStatusText = () => {
    if (apiRateLimited) return 'Rate limited';
    if (isUsingCachedData) return 'Last updated';
    return 'Last updated';
  };

  const shouldShow = !(!lastUpdated && !lastFetched);

  return {
    shouldShow,
    formatLastUpdated,
    getBannerColor,
    getTextColor,
    getStatusText,
  };
};
