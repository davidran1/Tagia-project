import { createContext, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const setUserDetails = (userData) => {
    setUser(userData);
  };
  const clearUserDetails = async () => {
    fetch("http://localhost:3000/api/v1/users/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      credentials: "include",
    });
    setUser(null);
  };
  useEffect(() => {
    const token = Cookies.get("jwt");

    if (token) {
      axios
        .get(`http://localhost:3000/api/v1/users/getUserData`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        })
        .then((response) => {
          setUser(response.data.data.user);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);
  return (
    <UserContext.Provider
      value={{ user, setUserDetails, clearUserDetails, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
