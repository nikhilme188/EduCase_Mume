import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const Album = () => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Album</Text>
    </View>
  );
};

export default Album;
