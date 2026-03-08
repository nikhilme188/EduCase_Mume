import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const Suggested = () => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Suggested</Text>
    </View>
  );
};

export default Suggested;
