import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  stockInfo: {
    padding: 16,
    borderBottomWidth: 1,
  },
  summaryTicker: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryPrice: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryChange: {
    fontSize: 16,
    fontWeight: '500',
  },
  chartContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chart: {
    borderRadius: 8,
    marginHorizontal: 0,
  },
  periodButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    minWidth: 60,
    alignItems: 'center',
  },
  selectedPeriodButton: {
    backgroundColor: '#10D07A',
  },
  periodButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedPeriodButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  periodDescription: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  periodDescriptionText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  keyMetrics: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricItem: {
    width: '47%',
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  aboutSection: {
    padding: 16,
    borderTopWidth: 1,
  },
  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  watchlistButton: {
    margin: 16,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  watchlistButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
