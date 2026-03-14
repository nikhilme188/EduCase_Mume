import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    paddingHorizontal: 16,
  },

  list: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  albumItem: {
    width: '48%',
  },

  albumImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    backgroundColor: '#E5E5E5',
  },

  albumDetails: {
    marginTop: 6,
  },

  albumTitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  albumMeta: {
    fontSize: 11,
    color: '#7A7A7A',
    marginTop: 2,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
  },

  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});