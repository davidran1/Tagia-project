import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export function useThemeContext() {
  return useContext(ThemeContext);
}
