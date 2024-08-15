import { createTheme } from "@mui/material/styles";

// Light Theme
export const lightTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 950,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "Rubik",
    fontSize: 18,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#271b54",
    },
    secondary: {
      main: "#61609b",
      text: "#757575",
      light: "#8187ba",
    },
    text: {
      secondary: "#e6e6e6",
    },
    background: {
      paper: "#f5f5f5",
    },
  },
});

// Dark Theme
export const darkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 950,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "Rubik",
    fontSize: 18,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#3b2e6e",
      text: "#ffff",
    },
    secondary: {
      main: "#61609b",
      text: "#e6e6e6",
      light: "#8187ba",
    },
    text: {
      secondary: "#e6e6e6",
    },
    background: {
      paper: "#262626",
    },
  },
});
