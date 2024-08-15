import IconButton from "@mui/material/IconButton";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import { useState } from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import PropTypes from "prop-types";
import { useUserContext } from "../hooks/useUserContext";

NavMenu.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      handleClick: PropTypes.func,
    })
  ).isRequired,
};

export default function NavMenu({ pages }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user } = useUserContext();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
        sx={{ color: "primary.text" }}
      >
        <DensityMediumIcon />
      </IconButton>
      <Menu
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "secondary.main",
            display: "flex",
            justifyContent: "center",
            fontSize: "1.5rem",
            color: "primary.text",
          },
        }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {pages.map((page) => (
          <MenuItem
            key={page.value}
            onClick={() => page.handleClick()}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {page.label}
          </MenuItem>
        ))}
        {user && (
          <div>
            <Divider sx={{ borderColor: "primary.text" }} variant="middle" />
            <Typography
              variant="body2"
              fontSize={"1.2rem"}
              sx={{ display: "flex", justifyContent: "center", py: "0.5rem" }}
            >
              {user?.name}
            </Typography>
          </div>
        )}
      </Menu>
    </>
  );
}
