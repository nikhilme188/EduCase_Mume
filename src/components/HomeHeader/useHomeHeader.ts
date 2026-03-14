import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { closeFilter } from '../../store/filterSlice';

export const useHomeHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSearchPress = () => {
    navigation.navigate('Search' as never);
  };

  const handleHeaderPress = () => {
    dispatch(closeFilter());
  };

  return {
    handleSearchPress,
    handleHeaderPress,
  };
};
