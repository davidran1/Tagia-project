import { useContext } from "react";
import AllUsersContext from "../contexts/AllUsersContext";

export const useAllUsers = () => useContext(AllUsersContext);
