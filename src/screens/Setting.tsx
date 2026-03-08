import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { useTheme } from '../hooks/useTheme';
import { darkTheme } from '../themes/themes';

const Setting = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>Settings</Text>
      <View style={styles.toggleContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Dark Theme</Text>
        <Switch
          value={theme === darkTheme}
          onValueChange={() => {
            dispatch(toggleTheme());
          }}
          trackColor={{ false: '#767577', true: '#e0924d' }}
          thumbColor={theme === darkTheme ? '#FF8216' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default Setting;