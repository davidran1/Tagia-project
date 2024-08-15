import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useCategories } from "../hooks/useCategories";

const MainLayout = () => {
  const { categories, isLoading } = useCategories();
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header filter={isMainPage} filters={isMainPage ? categories : []} />
      <Outlet />
    </>
  );
};

export default MainLayout;
