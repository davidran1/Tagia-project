import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Tab,
  Tabs,
} from "@mui/material";

import Cookies from "js-cookie";

import ResetPassword from "./ResetPassword";
import SaveButton from "./Buttons/SaveButton";
import EditButton from "./Buttons/EditButton";
import CancelButton from "./Buttons/CancelButton";
import InnerTabs from "./InnerTabs";
import { majors, years } from "../../config";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// Rest of the UserDetails component
function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    major: "",
    year: "",
  });
  const [tabValue, setTabValue] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/users/getUserData`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data.data.user);
        setFormData({
          name: data.data.user.name,
          email: data.data.user.email,
          major: data.data.user.major,
          year: data.data.user.year,
        });
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [userId]);

  const handleDiscardChanges = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        major: user.major,
        year: user.year,
      });
      setEditMode(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    console.log(formData);
    fetch(`http://localhost:3000/api/v1/users/updateUserAllData`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUser(data.data.user);
        setFormData({
          name: data.data.user.name,
          email: data.data.user.email,
          major: data.data.user.major,
          year: data.data.user.year,
        });
        setEditMode(false);
        setSuccessMessage("השינויים נשמרו בהצלחה");
        setTimeout(() => setSuccessMessage(""), 4000);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleTabChange = (event, newValue) => {
    if (newValue !== 0 && tabValue === 0) {
      handleDiscardChanges();
    }
    setTabValue(newValue);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Container>
        <Box my={4}>
          <Typography variant="h5" component="div">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        width: "100%",
        direction: "rtl",
        display: "flex",
        position: "absolute",
        right: 100,
        top: 150,
      }}
    >
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          orientation="vertical"
          variant="scrollable"
          aria-label="user details tabs"
          sx={{
            flexDirection: "column",
            borderColor: "divider",
            width: "200px",
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab label="פרטים אישיים" />
          <Tab label="האירועים שלי" />
          <Tab label="שינוי סיסמה" />
          {/* <Tab label="פרטי תשלום" /> */}
        </Tabs>

        <Box sx={{ marginLeft: "auto", marginRight: 10, width: "50%" }}>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="שם מלא"
                  name="name"
                  autoComplete="name"
                  color="secondary"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="אימייל"
                  name="email"
                  autoComplete="email"
                  color="secondary"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ width: "100%" }}>
                  <FormControl fullWidth required color="secondary">
                    <InputLabel id="major-label">מסלול</InputLabel>
                    <Select
                      labelId="major-label"
                      id="major"
                      name="major"
                      value={formData.major}
                      defaultValue=""
                      onChange={handleInputChange}
                      disabled={!editMode}
                    >
                      {majors.map((major) => (
                        <MenuItem key={major} value={major}>
                          {major}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ width: "100%" }}>
                  <FormControl fullWidth required color="secondary">
                    <InputLabel id="year-label">שנה</InputLabel>
                    <Select
                      labelId="year-label"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

            {!editMode ? (
              <EditButton setEditMode={setEditMode} label="עריכה" />
            ) : (
              <Box sx={{ display: "flex" }}>
                <CancelButton
                  handleDiscardChanges={handleDiscardChanges}
                  label="ביטול"
                />
                <SaveButton handleSave={handleSave} label="שמירה" />
              </Box>
            )}
            {successMessage && (
              <Typography color="green">{successMessage}</Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <InnerTabs />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <ResetPassword
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </TabPanel>

          {/* <TabPanel value={tabValue} index={3}>
            <Typography variant="h4" component="div">פרטי התשלום שלי</Typography>
          </TabPanel> */}
        </Box>
      </Box>
    </Container>
  );
}

export default UserDetails;

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};
