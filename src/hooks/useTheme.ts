import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { lightTheme, darkTheme, Theme } from '../themes/themes';

export const useTheme = (): Theme => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  return isDark ? darkTheme : lightTheme;
};