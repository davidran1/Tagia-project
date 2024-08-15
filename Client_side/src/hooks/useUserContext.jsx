import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export function useUserContext() {
  return useContext(UserContext);
}
