import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '../hooks/useTheme';
import { Songs, Artist, Album, Suggested } from './HomeTabs';
import HomeHeader from '../components/HomeHeader';

const Tab = createMaterialTopTabNavigator();

const Home = () => {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <HomeHeader />

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#FF8216',
          tabBarInactiveTintColor: '#888888',
          tabBarStyle: {
            backgroundColor: theme.background,
            borderBottomWidth: 1,
            borderBottomColor: '#333333',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#FF8216',
            height: 3,
          },
        }}
      >
        <Tab.Screen name="Songs" component={Songs} />
        <Tab.Screen name="Artist" component={Artist} />
        <Tab.Screen name="Album" component={Album} />
        <Tab.Screen name="Suggested" component={Suggested} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;