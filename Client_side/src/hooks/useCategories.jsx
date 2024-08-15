import { useContext } from "react";
import { CategoriesContext } from "../contexts/CategoriesContext";

export function useCategories() {
  return useContext(CategoriesContext);
}
