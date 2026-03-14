import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/useTheme';
import { closeFilter } from '../../store/filterSlice';

const HomeHeader = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSearchPress = () => {
    navigation.navigate('Search' as never);
  };

  const handleHeaderPress = () => {
    dispatch(closeFilter());
  };

  return (
    <TouchableOpacity 
      style={[styles.header, { backgroundColor: "theme.background" }]}
      onPress={handleHeaderPress}
      activeOpacity={1}
    >
      <View style={styles.logo}>
        <Image
          source={require('../../../assets/mume.png')}
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
    </TouchableOpacity>
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
