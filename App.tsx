/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#181A20' : '#ffffff' }} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#181A20' : '#ffffff'}
      />
      <AppNavigator />
    </SafeAreaView>
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
