import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { Colors } from '../constants/theme';

const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
  colors: Colors.dark
});

export const CustomThemeProvider = ({ children }: any) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export function useColorScheme() {
  const { isDark } = useTheme();
  return isDark ? 'dark' : 'light';
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
