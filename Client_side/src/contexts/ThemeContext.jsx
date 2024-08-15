import React, { useState } from "react";
import PropTypes from "prop-types";

import { darkTheme, lightTheme } from "../themeConfig";

export const ThemeContext = React.createContext({});

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(darkTheme);
  function toggleTheme() {
    setTheme((theme) => (theme === lightTheme ? darkTheme : lightTheme));
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
