import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const CategoriesContext = createContext({});

export const CategoriesContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/v1/events/getRellevantCategories"
        );

        const fetchedCategories = response.data.data.collections.map(
          (category) => ({
            value: category,
            label: category,
          })
        );

        setCategories([{ value: "הכל", label: "הכל" }, ...fetchedCategories]);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, isLoading, error }}>
      {children}
    </CategoriesContext.Provider>
  );
};

CategoriesContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
