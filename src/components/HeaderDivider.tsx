import React from 'react';
import { View, StyleSheet } from 'react-native';

const HeaderDivider: React.FC = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#d7d4d4',
  },
});

export default HeaderDivider;
