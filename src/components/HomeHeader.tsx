import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';

const HomeHeader = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleSearchPress = () => {
    navigation.navigate('Search' as never);
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <View style={styles.logo}>
        <Image
          source={require('../../assets/mume.png')}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.text }]}>Mume</Text>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity onPress={handleSearchPress}>
          <Ionicons name="search" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleButton: {
    padding: 8,
  },
});

export default HomeHeader;
