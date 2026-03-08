import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const Artist = () => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Artist</Text>
    </View>
  );
};

export default Artist;
