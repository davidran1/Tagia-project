import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

const AllUsersContext = createContext();

export const AllUsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(0);
  const [reload, setReload] = useState(false);

  const blockUser = (id) => {
    fetch(`http://localhost:3000/api/v1/users/toggleBlockUser/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    }).then((response) => {
      if (!response.ok) {
        console.error("Failed to block user");
      } else {
        setReload(!reload);
      }
    });
  };
  const updateUser = (editedUser) => {
    console.log(editedUser);
    fetch(`http://localhost:3000/api/v1/users/edit-users/${editedUser._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify(editedUser),
    }).then((response) => {
      if (!response.ok) {
        console.error("Failed to update user");
      } else {
        setReload(!reload);
      }
    });
  };
  const movePage = (direction) => {
    setPage((prevPage) => prevPage + direction);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/getAllUsers?page=${page}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
        setResults(data.results);
      } else {
        console.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, [page, reload]);

  return (
    <AllUsersContext.Provider
      value={{ users, updateUser, page, movePage, results, blockUser }}
    >
      {children}
    </AllUsersContext.Provider>
  );
};

AllUsersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AllUsersContext;
