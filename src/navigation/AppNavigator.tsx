import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Home from '../screens/Home';
import Favourite from '../screens/Favourite';
import Playlist from '../screens/Playlist';
import Setting from '../screens/Setting';
import Player from '../screens/Player';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const getTabBarIcon = (routeName: string) => ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
  let iconName: string;

  if (routeName === 'Home') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (routeName === 'Favourite') {
    iconName = focused ? 'heart' : 'heart-outline';
  } else if (routeName === 'Playlist') {
    iconName = focused ? 'list' : 'list-outline';
  } else if (routeName === 'Setting') {
    iconName = focused ? 'settings' : 'settings-outline';
  } else {
    iconName = 'circle';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

const TabNavigator = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: getTabBarIcon(route.name),
        tabBarActiveTintColor: '#FF8216',
        tabBarInactiveTintColor: isDark ? '#888888' : 'gray',
        tabBarStyle: {
          backgroundColor: isDark ? '#181A20' : '#ffffff',
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 8,
        },
        tabBarLabelPosition: 'below-icon',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favourite" component={Favourite} />
      <Tab.Screen name="Playlist" component={Playlist} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="Player" component={Player} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;