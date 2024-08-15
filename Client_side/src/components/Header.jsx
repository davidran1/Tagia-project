import { AppBar, Button, Grid, Toolbar, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "/Logo.png";
import NavMenu from "./NavMenu";
import FilterTabs from "./FilterTabs";
import FilterSelect from "./FilterSelect";
import ThemeSwitch from "./ThemeSwitch";
import { useUserContext } from "../hooks/useUserContext";
import { useNavMenuOptions } from "../hooks/useNavMenuOptions";

function Header({ filter = false, filters = [] }) {
  const options = useNavMenuOptions();

  // Used to change the filter component when UI breaks
  const uiBreakFilter = useMediaQuery("(max-width: 1235px)");

  // Used to change the login and signup button when UI breaks
  const uiBreakThemeswitch_loginSignup = useMediaQuery("(max-width: 660px)");
  const { user } = useUserContext();
  return (
    <>
      <Grid container>
        <AppBar
          enableColorOnDark
          position="relative"
          color="primary"
          style={{
            userSelect: "none",
            width: "100%",
            display: "flex",
            height: "5rem",
            justifyContent: "space-between",
          }}
        >
          <Toolbar
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              direction: "rtl",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {uiBreakThemeswitch_loginSignup ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ThemeSwitch />
                  {user && <NavMenu pages={options} />}
                </Box>
              ) : (
                user && <NavMenu pages={options} />
              )}
              <Link to="/">
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    height: "4rem",
                    marginRight: "10px",
                  }}
                />
              </Link>
            </div>

            {filter ? (
              uiBreakFilter ? (
                <FilterSelect filters={filters} />
              ) : (
                <FilterTabs filters={filters} />
              )
            ) : null}
            <div>
              {!user && (
                <>
                  {uiBreakThemeswitch_loginSignup ? (
                    <>
                      <Link to="/signup">
                        <Button color="secondary" variant="contained">
                          הרשמה
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/signup">
                        <Button color="secondary" variant="contained">
                          הרשמה
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button
                          color="secondary"
                          variant="outlined"
                          style={{ marginRight: "1rem" }}
                        >
                          התחברות
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
              <ThemeSwitch />
            </div>
          </Toolbar>
        </AppBar>
      </Grid>
    </>
  );
}

Header.propTypes = {
  filter: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Header;
