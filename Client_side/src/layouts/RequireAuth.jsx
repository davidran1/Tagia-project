import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";
import PropTypes from "prop-types";
import { Box, CircularProgress } from "@mui/material";

export default function RequireAuth({ allowedRoles }) {
  const location = useLocation();
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <Box p={4} sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/no-access" replace />;
  }

  return <Outlet />;
}

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
