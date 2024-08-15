import { useNavigate } from "react-router-dom";
import { useUserContext } from "./useUserContext";

import {
  adminNavMenuOptions,
  userNavMenuOptions,
  eventManagerNavMenuOptions,
} from "../config";

export function useNavMenuOptions() {
  const navigate = useNavigate();
  const { user, clearUserDetails } = useUserContext();
  if (!user) return {};
  let options = [];
  switch (user.role) {
    case "User":
      userNavMenuOptions.forEach((option) => {
        options.push({
          value: option.value,
          label: option.label,
          handleClick: () => navigate(option.navigateTO),
        });
      });
      break;
    case "Admin":
      adminNavMenuOptions.forEach((option) => {
        options.push({
          value: option.value,
          label: option.label,
          handleClick: () => navigate(option.navigateTO),
        });
      });
      break;
    case "EventOrganizer":
      eventManagerNavMenuOptions.forEach((option) => {
        options.push({
          value: option.value,
          label: option.label,
          handleClick: () => navigate(option.navigateTO),
        });
      });
      break;
  }
  options.push({
    value: "logout",
    label: "התנתק",
    handleClick: () => {
      clearUserDetails();
      navigate("/");
    },
  });

  return options;
}
