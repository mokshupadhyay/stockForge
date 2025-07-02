import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  stockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stockInfo: {
    flex: 1,
  },
  ticker: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  volume: {
    fontSize: 13,
    fontWeight: '500',
  },
  stockRight: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  change: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
