import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Button, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { Link, useSearchParams } from "react-router-dom";

FilterTabs.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

function FilterTabs({ filters }) {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || filters[0].value;
  const [value, setValue] = useState(category);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const visibleTabs = filters.length > 8 ? filters.slice(0, 7) : filters;
  const moreTabs = filters.length > 8 ? filters.slice(7) : [];

  useEffect(() => {
    setValue(category);
  }, [category, searchParams]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value) => {
    setValue(value);
    handleClose();
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          ".MuiTab-root": { color: (theme) => theme.palette.primary.text },
        }}
      >
        {visibleTabs.map((filter) => (
          <Tab
            key={filter.value}
            label={filter.label}
            value={filter.value}
            component={Link}
            to={`/?category=${filter.value}&sort=${
              searchParams.get("sort") || "Cost"
            }&order=${searchParams.get("order") || "down"}`}
            sx={{ textDecoration: "none", color: "inherit" }}
          />
        ))}
        {moreTabs.length > 0 && (
          <Button
            aria-controls="more-tabs-menu"
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit"
          >
            עוד...
          </Button>
        )}
      </Tabs>
      <Menu
        id="more-tabs-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {moreTabs.map((filter) => (
          <MenuItem
            key={filter.value}
            onClick={() => handleMenuItemClick(filter.value)}
            component={Link}
            to={`/?category=${filter.value}&sort=${
              searchParams.get("sort") || "Cost"
            }&order=${searchParams.get("order") || "down"}`}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            {filter.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default FilterTabs;
